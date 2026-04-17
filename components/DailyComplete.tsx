'use client'

import { useState } from 'react'
import { PlayerResult } from '@/lib/types'
import { buildShareText, getPuzzleNumber } from '@/lib/daily'

interface DailyCompleteProps {
  results: PlayerResult[]
}

export default function DailyComplete({ results }: DailyCompleteProps) {
  const [copied, setCopied] = useState(false)
  const puzzleNumber = getPuzzleNumber()

  const total = results.reduce((sum, r) => sum + r.score, 0)
  const maxScore = results.length * 500
  const solved = results.filter((r) => r.solved).length
  const pct = Math.round((total / maxScore) * 100)

  function handleShare() {
    const text = buildShareText(
      puzzleNumber,
      results.map((r) => ({
        score: r.score,
        solved: r.solved,
        guesses: r.guesses,
      })),
    )
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const grade = pct >= 90 ? 'S' : pct >= 70 ? 'A' : pct >= 50 ? 'B' : pct >= 30 ? 'C' : 'D'
  const gradeColor =
    grade === 'S' ? 'text-amber-500' :
    grade === 'A' ? 'text-forest' :
    grade === 'B' ? 'text-ember' :
    grade === 'C' ? 'text-text-muted' :
    'text-danger'

  return (
    <div className="max-w-md mx-auto animate-slide-up px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="font-slab text-4xl text-navy mb-1 tracking-wide" style={{ fontFamily: 'var(--font-slab)' }}>
          ROAD TRIP ROSTER
        </div>
        <div className="text-text-muted text-sm">#{puzzleNumber}</div>
      </div>

      {/* Score card */}
      <div className="bg-white rounded-2xl border-2 border-map-border p-6 mb-5 text-center shadow-sm">
        {/* Grade */}
        <div className={`font-slab text-7xl mb-2 ${gradeColor}`} style={{ fontFamily: 'var(--font-slab)' }}>
          {grade}
        </div>
        <div className="font-mono text-3xl font-bold text-navy mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
          {total.toLocaleString()} pts
        </div>
        <div className="text-text-muted text-sm">
          {solved}/{results.length} players solved · {pct}% score
        </div>
      </div>

      {/* Per-player breakdown */}
      <div className="space-y-2 mb-6">
        {results.map((result, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white rounded-xl border-2 border-map-border px-4 py-3"
          >
            <div className="text-xl">{result.solved ? (result.guesses.length === 1 ? '🏆' : '✅') : '❌'}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-text-warm truncate">{result.player.name}</div>
              <div className="text-xs text-text-muted">
                {result.solved
                  ? `Solved in ${result.guesses.length} guess${result.guesses.length === 1 ? '' : 'es'}`
                  : `Failed — ${result.guesses.length} guess${result.guesses.length === 1 ? '' : 'es'} used`}
              </div>
            </div>
            <div className={`font-mono text-sm font-bold ${result.score > 0 ? 'text-forest' : 'text-text-muted'}`}
              style={{ fontFamily: 'var(--font-mono)' }}>
              +{result.score}
            </div>
          </div>
        ))}
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full py-4 bg-ember text-white font-slab text-base rounded-xl hover:bg-ember/90 active:scale-[0.99] transition-all tracking-wide flex items-center justify-center gap-2"
        style={{ fontFamily: 'var(--font-slab)' }}
      >
        {copied ? (
          <>✓ COPIED TO CLIPBOARD</>
        ) : (
          <>🚗 SHARE RESULTS</>
        )}
      </button>

      {/* Come back tomorrow */}
      <div className="text-center mt-5">
        <p className="text-text-muted text-sm">New roster drops every day at midnight UTC.</p>
        <p className="text-text-muted text-xs mt-1">Come back tomorrow for another trip! 🗺️</p>
      </div>
    </div>
  )
}
