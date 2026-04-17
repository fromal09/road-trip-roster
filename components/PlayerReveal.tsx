'use client'

import { Player, Vehicle } from '@/lib/types'
import { getPlayerStops } from '@/lib/players'
import { getVehicle, getHardVehicle, getVehicleEmoji, getVehicleLabel, getSportBadgeStyle } from '@/lib/daily'
import { Difficulty } from '@/lib/types'

interface PlayerRevealProps {
  player: Player
  guesses: string[]
  score: number
  solved: boolean
  difficulty: Difficulty
  onNext: () => void
  isLast: boolean
}

export default function PlayerReveal({ player, guesses, score, solved, difficulty, onNext, isLast }: PlayerRevealProps) {
  const stops = getPlayerStops(player)
  const hardVehicle = getHardVehicle(player.id)

  return (
    <div className="animate-slide-up w-full">
      {/* Result header */}
      <div className={`rounded-xl p-4 mb-4 text-center border-2 ${
        solved
          ? 'bg-forest/10 border-forest/40 text-forest'
          : 'bg-danger/10 border-danger/40 text-danger'
      }`}>
        <div className="text-2xl mb-1">{solved ? '🎉' : '😭'}</div>
        <div className="font-slab text-lg tracking-wide" style={{ fontFamily: 'var(--font-slab)' }}>
          {solved ? `Got it in ${guesses.length} guess${guesses.length === 1 ? '' : 'es'}!` : 'Better luck next time'}
        </div>
        <div className="font-mono text-sm mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
          {score > 0 ? `+${score} pts` : '0 pts'}
        </div>
      </div>

      {/* Player identity card */}
      <div className="bg-white rounded-xl border-2 border-map-border p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-slab text-2xl text-navy" style={{ fontFamily: 'var(--font-slab)' }}>
              {player.name}
            </h2>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getSportBadgeStyle(player.sport)}`}>
            {player.sport}
          </span>
        </div>

        {/* Career journey */}
        <div className="space-y-0">
          {stops.map((stop, i) => {
            let vehicle: Vehicle | null = null
            let vehicleLabel = ''
            if (i > 0) {
              vehicle = getVehicle(
                stops[i - 1].years[0] === 0 ? undefined : stops[i - 1].years,
                difficulty,
                hardVehicle,
              )
              vehicleLabel = getVehicleLabel(vehicle)
            }

            return (
              <div key={i}>
                {/* Vehicle connector */}
                {vehicle && (
                  <div className="flex items-center gap-2 py-1.5 pl-[22px]">
                    <div className="w-px h-4 bg-map-border" />
                    <span className="text-base">{getVehicleEmoji(vehicle)}</span>
                    {difficulty === 'easy' && (
                      <span className="text-xs text-text-muted italic">{vehicleLabel}</span>
                    )}
                  </div>
                )}

                {/* Stop */}
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold ${
                    stop.isCollege ? 'bg-forest' : 'bg-ember'
                  }`}>
                    {stop.isCollege ? '🎓' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-text-warm">{stop.teamName}</div>
                    <div className="text-xs text-text-muted">{stop.city}</div>
                  </div>
                  {!stop.isCollege && stop.years[0] > 0 && (
                    <div className="text-xs font-mono text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>
                      {stop.years[0]}–{stop.years[1]}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Wrong guesses */}
        {guesses.length > 0 && !solved && (
          <div className="mt-3 pt-3 border-t border-map-border">
            <div className="text-xs text-text-muted mb-1.5">Your guesses:</div>
            <div className="flex flex-wrap gap-1.5">
              {guesses.map((g, i) => (
                <span key={i} className="text-xs bg-danger/10 text-danger border border-danger/30 rounded px-2 py-0.5">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="w-full py-3.5 bg-navy text-white font-slab text-base rounded-xl hover:bg-navy/90 active:scale-[0.99] transition-all tracking-wide"
        style={{ fontFamily: 'var(--font-slab)' }}
      >
        {isLast ? '🏁 SEE RESULTS' : 'NEXT PLAYER →'}
      </button>
    </div>
  )
}
