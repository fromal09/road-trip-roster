'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Player, GamePhase, Difficulty, PlayerResult } from '@/lib/types'
import { getDailyPlayers, getScoreForGuesses, getPuzzleNumber, normalizeName } from '@/lib/daily'
import { getPlayerByName, getPlayerStops } from '@/lib/players'
import GuessInput from '@/components/GuessInput'
import PlayerReveal from '@/components/PlayerReveal'
import StopList from '@/components/StopList'
import DailyComplete from '@/components/DailyComplete'

// Disable SSR for the map component (d3-geo + react-simple-maps need the browser)
const GameMap = dynamic(() => import('@/components/GameMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-map-water rounded-xl border-2 border-map-border flex items-center justify-center" style={{ aspectRatio: '975/610' }}>
      <div className="text-text-muted text-sm animate-pulse">Loading map…</div>
    </div>
  ),
})

const MAX_GUESSES = 5
const SPORT_EMOJI: Record<string, string> = { NBA: '🏀', NFL: '🏈', MLB: '⚾', NHL: '🏒' }

export default function HomePage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [playerIndex, setPlayerIndex] = useState(0)
  const [phase, setPhase] = useState<GamePhase>('landing')
  const [currentLeg, setCurrentLeg] = useState(-1)
  const [journeyStarted, setJourneyStarted] = useState(false)
  const [guesses, setGuesses] = useState<string[]>([])
  const [wrongGuessPlayers, setWrongGuessPlayers] = useState<Player[]>([])
  const [results, setResults] = useState<PlayerResult[]>([])
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [shakeInput, setShakeInput] = useState(false)
  const [showHowTo, setShowHowTo] = useState(false)

  // Revealed up to: how many stops have been shown so far
  // -1 = nothing, 0 = first stop visible, etc.
  const revealedUpTo = currentLeg  // currentLeg tracks the leg being animated; stops revealed = currentLeg

  const legTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPlayers(getDailyPlayers())
  }, [])

  const currentPlayer = players[playerIndex]
  const puzzleNumber = getPuzzleNumber()

  // ─── Journey orchestration ────────────────────────────────────────────────

  const startJourney = useCallback(() => {
    if (!currentPlayer) return
    setJourneyStarted(true)
    setPhase('animating')
    setCurrentLeg(0)
    // Note: leg advancement is driven by onLegComplete callbacks from GameMap
  }, [currentPlayer])

  const handleLegComplete = useCallback((legIndex: number) => {
    if (!currentPlayer) return
    const stops = getPlayerStops(currentPlayer)
    const totalLegs = stops.length - 1
    const nextLeg = legIndex + 1

    if (nextLeg >= totalLegs) {
      // All legs done → allow guessing
      legTimerRef.current = setTimeout(() => {
        setCurrentLeg(-1)
        setPhase('guessing')
      }, 600)
    } else {
      // Small pause between legs
      legTimerRef.current = setTimeout(() => {
        setCurrentLeg(nextLeg)
      }, 400)
    }
  }, [currentPlayer])

  useEffect(() => {
    return () => {
      if (legTimerRef.current) clearTimeout(legTimerRef.current)
    }
  }, [])

  // ─── Guess handling ───────────────────────────────────────────────────────

  function handleGuess(name: string) {
    if (phase !== 'guessing' || !currentPlayer) return

    const newGuesses = [...guesses, name]
    const isCorrect = normalizeName(name) === normalizeName(currentPlayer.name)

    if (isCorrect) {
      const score = getScoreForGuesses(newGuesses.length, false)
      finishPlayer(newGuesses, true, score)
    } else {
      // Wrong guess — shake input, add ghost path
      triggerShake()
      const guessedPlayer = getPlayerByName(name)
      if (guessedPlayer) {
        setWrongGuessPlayers((prev) => [...prev, guessedPlayer])
      }

      if (newGuesses.length >= MAX_GUESSES) {
        // Out of guesses
        setGuesses(newGuesses)
        finishPlayer(newGuesses, false, 0)
      } else {
        setGuesses(newGuesses)
      }
    }
  }

  function triggerShake() {
    setShakeInput(true)
    setTimeout(() => setShakeInput(false), 500)
  }

  function finishPlayer(finalGuesses: string[], solved: boolean, score: number) {
    if (!currentPlayer) return
    const result: PlayerResult = {
      player: currentPlayer,
      guesses: finalGuesses.map((g, i) => ({
        name: g,
        correct: i === finalGuesses.length - 1 && solved,
      })),
      score,
      solved,
    }
    setResults((prev) => [...prev, result])
    setGuesses(finalGuesses)
    setPhase('revealed')
  }

  function handleNextPlayer() {
    const nextIndex = playerIndex + 1
    if (nextIndex >= players.length) {
      setPhase('complete')
    } else {
      setPlayerIndex(nextIndex)
      setPhase('landing')
      setCurrentLeg(-1)
      setJourneyStarted(false)
      setGuesses([])
      setWrongGuessPlayers([])
    }
  }

  // ─── Render helpers ───────────────────────────────────────────────────────

  if (!currentPlayer && phase !== 'complete') {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-text-muted animate-pulse">Loading today's roster…</div>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div className="min-h-dvh bg-parchment">
        <DailyComplete results={results} />
      </div>
    )
  }

  const stops = currentPlayer ? getPlayerStops(currentPlayer) : []
  const totalPlayers = players.length

  return (
    <div className="min-h-dvh bg-parchment flex flex-col">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-navy text-white px-4 py-3 flex items-center justify-between shadow-md flex-shrink-0">
        <div>
          <div className="font-slab text-lg leading-none tracking-wider" style={{ fontFamily: 'var(--font-slab)' }}>
            ROAD TRIP ROSTER
          </div>
          <div className="text-white/50 text-[10px] font-mono mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
            #{puzzleNumber}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty toggle */}
          <button
            onClick={() => setDifficulty((d) => d === 'easy' ? 'hard' : 'easy')}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              difficulty === 'easy'
                ? 'border-white/30 text-white/70 hover:text-white hover:border-white/60'
                : 'border-amber-400 text-amber-400'
            }`}
          >
            {difficulty === 'easy' ? '🧭 Easy' : '🔥 Hard'}
          </button>

          <button
            onClick={() => setShowHowTo((v) => !v)}
            className="w-8 h-8 rounded-full border border-white/30 text-white/70 hover:text-white hover:border-white/60 transition-colors text-sm flex items-center justify-center"
          >
            ?
          </button>
        </div>
      </header>

      {/* ── How To Play modal ──────────────────────────────── */}
      {showHowTo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowHowTo(false)}>
          <div className="bg-white rounded-2xl border-2 border-map-border max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-slab text-xl text-navy mb-4" style={{ fontFamily: 'var(--font-slab)' }}>HOW TO PLAY</h2>
            <div className="space-y-3 text-sm text-text-warm">
              <p>🗺️ Watch a player's career journey animated across the map.</p>
              <p>🤔 Each stop is a team they played for, shown in chronological order.</p>
              <p>🎓 The first stop (green) is their college — if applicable.</p>
              <p>✈️ In <b>Easy mode</b>, the transport gives a hint: hitchhiking = long tenure, car = medium, plane = quick stop.</p>
              <p>❓ Guess the mystery player. You have <b>5 guesses</b>.</p>
              <p>👻 Wrong guesses show that player's route as a ghost path.</p>
              <p>🏆 Score up to 500 pts per player. New roster daily!</p>
            </div>
            <button onClick={() => setShowHowTo(false)} className="mt-5 w-full py-2.5 bg-navy text-white rounded-xl text-sm font-medium">
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ── Player progress bar ────────────────────────────── */}
      <div className="bg-white/60 border-b border-map-border px-4 py-2 flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-text-muted font-medium">Player</span>
        <div className="flex gap-1.5 flex-1">
          {players.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                i < playerIndex
                  ? results[i]?.solved ? 'bg-forest' : 'bg-danger/60'
                  : i === playerIndex
                  ? 'bg-ember'
                  : 'bg-map-border'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-mono text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>
          {playerIndex + 1}/{totalPlayers}
        </span>
        <span className="text-base">{SPORT_EMOJI[currentPlayer.sport]}</span>
      </div>

      {/* ── Main content ───────────────────────────────────── */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-auto">

        {/* Map area */}
        <div className="flex-1 p-3 lg:p-4 flex flex-col gap-3 min-h-0">
          <GameMap
            player={currentPlayer}
            currentLeg={currentLeg}
            difficulty={difficulty}
            ghostPlayers={wrongGuessPlayers}
            onLegComplete={handleLegComplete}
            journeyStarted={journeyStarted}
          />
        </div>

        {/* Sidebar / Controls */}
        <div className="lg:w-72 xl:w-80 flex flex-col gap-3 p-3 lg:p-4 lg:border-l border-map-border flex-shrink-0">

          {/* Stop list */}
          <StopList
            player={currentPlayer}
            revealedUpTo={revealedUpTo}
            difficulty={difficulty}
            journeyStarted={journeyStarted}
          />

          {/* Control area */}
          <div className="bg-white/70 rounded-xl border border-map-border p-3 flex flex-col gap-3">

            {phase === 'landing' && (
              <div className="animate-fade-in">
                <div className="text-xs text-text-muted mb-3 text-center">
                  Animated journey will trace this player's career path.
                  {difficulty === 'easy' && ' Vehicle type hints at tenure length.'}
                </div>
                <button
                  onClick={startJourney}
                  className="w-full py-4 bg-ember text-white font-slab text-base rounded-xl hover:bg-ember/90 active:scale-[0.99] transition-all tracking-wide"
                  style={{ fontFamily: 'var(--font-slab)' }}
                >
                  🚗 START JOURNEY
                </button>
              </div>
            )}

            {phase === 'animating' && (
              <div className="animate-fade-in text-center py-3">
                <div className="text-sm text-text-muted animate-pulse">
                  {currentLeg >= 0
                    ? `Traveling to stop ${currentLeg + 2} of ${stops.length}…`
                    : 'Preparing route…'}
                </div>
                <div className="text-2xl mt-2 animate-bounce">🚗</div>
              </div>
            )}

            {phase === 'guessing' && (
              <div className="animate-slide-up">
                <GuessInput
                  onGuess={handleGuess}
                  disabled={false}
                  guessesUsed={guesses.length}
                  maxGuesses={MAX_GUESSES}
                  wrongGuesses={guesses}
                  shake={shakeInput}
                />
              </div>
            )}

            {phase === 'revealed' && results.length > 0 && (
              <PlayerReveal
                player={currentPlayer}
                guesses={guesses}
                score={results[results.length - 1]?.score ?? 0}
                solved={results[results.length - 1]?.solved ?? false}
                difficulty={difficulty}
                onNext={handleNextPlayer}
                isLast={playerIndex === players.length - 1}
              />
            )}
          </div>

          {/* Score tally during session */}
          {results.length > 0 && phase !== 'revealed' && (
            <div className="bg-navy/5 rounded-xl border border-map-border px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-text-muted">Score so far</span>
              <span className="font-mono font-bold text-navy text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                {results.reduce((s, r) => s + r.score, 0).toLocaleString()} pts
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
