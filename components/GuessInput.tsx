'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { searchPlayers } from '@/lib/players'
import { Player } from '@/lib/types'

interface GuessInputProps {
  onGuess: (name: string) => void
  disabled: boolean
  guessesUsed: number
  maxGuesses: number
  wrongGuesses: string[]
  shake: boolean
}

export default function GuessInput({ onGuess, disabled, guessesUsed, maxGuesses, wrongGuesses, shake }: GuessInputProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<Player[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const remaining = maxGuesses - guessesUsed

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  function handleChange(val: string) {
    setInput(val)
    setSelectedIndex(-1)
    if (val.length >= 2) {
      const matches = searchPlayers(val)
      setSuggestions(matches)
      setShowDropdown(matches.length > 0)
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }

  function handleSelect(name: string) {
    setInput(name)
    setSuggestions([])
    setShowDropdown(false)
    submitGuess(name)
  }

  function submitGuess(name: string) {
    const trimmed = name.trim()
    if (!trimmed || disabled) return
    setInput('')
    setSuggestions([])
    setShowDropdown(false)
    onGuess(trimmed)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (e.key === 'Enter') submitGuess(input)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex].name)
      } else {
        submitGuess(input)
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const sportEmoji: Record<string, string> = { NBA: '🏀', NFL: '🏈', MLB: '⚾', NHL: '🏒' }

  return (
    <div className="w-full">
      {/* Lives remaining */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-text-muted text-sm font-medium">Lives:</span>
        <div className="flex gap-1">
          {Array.from({ length: maxGuesses }).map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                i < guessesUsed
                  ? 'border-danger bg-danger opacity-40'
                  : 'border-ember bg-ember'
              }`}
            />
          ))}
        </div>
        <span className="text-text-muted text-sm ml-1">{remaining} remaining</span>
      </div>

      {/* Wrong guesses list */}
      {wrongGuesses.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {wrongGuesses.map((g, i) => (
            <span key={i} className="text-xs bg-danger/10 text-danger border border-danger/30 rounded px-2 py-0.5 font-medium">
              ✗ {g}
            </span>
          ))}
        </div>
      )}

      {/* Input + button */}
      <div className="relative">
        <div
          className={`flex gap-2 ${shake ? 'animate-shake' : ''}`}
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              disabled={disabled}
              placeholder="Type a player name..."
              className="w-full px-4 py-3 rounded-lg border-2 border-map-border bg-white text-text-warm placeholder-text-muted/60 font-sans text-sm focus:outline-none focus:border-ember disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              autoComplete="off"
              spellCheck={false}
            />

            {/* Suggestions dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full mt-1 bg-white border-2 border-map-border rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in"
              >
                {suggestions.map((player, i) => (
                  <button
                    key={player.id}
                    onMouseDown={(e) => { e.preventDefault(); handleSelect(player.name) }}
                    className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-parchment transition-colors ${
                      i === selectedIndex ? 'bg-parchment' : ''
                    }`}
                  >
                    <span className="text-base">{sportEmoji[player.sport] ?? '🏅'}</span>
                    <span className="text-sm font-medium text-text-warm">{player.name}</span>
                    <span className="ml-auto text-xs text-text-muted font-mono">{player.sport}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => submitGuess(input)}
            disabled={disabled || !input.trim()}
            className="px-5 py-3 bg-ember text-white font-slab rounded-lg hover:bg-ember/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm tracking-wide"
            style={{ fontFamily: 'var(--font-slab)' }}
          >
            GUESS
          </button>
        </div>
      </div>
    </div>
  )
}
