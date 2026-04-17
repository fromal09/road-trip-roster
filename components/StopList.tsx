'use client'

import { Player, Vehicle, Difficulty } from '@/lib/types'
import { getPlayerStops } from '@/lib/players'
import { getVehicle, getHardVehicle, getVehicleEmoji } from '@/lib/daily'

interface StopListProps {
  player: Player
  currentLeg: number       // which leg is animating (-1 = not started or complete)
  journeyStarted: boolean
  journeyComplete: boolean // true once all legs done and currentLeg resets to -1
  difficulty: Difficulty
}

export default function StopList({ player, currentLeg, journeyStarted, journeyComplete, difficulty }: StopListProps) {
  const stops = getPlayerStops(player)
  const hardVehicle = getHardVehicle(player.id)

  // Stop i is revealed when: journey complete OR vehicle has arrived (currentLeg >= i)
  // currentLeg=0 means leg 0 animating → stop 0 (departure) is revealed (0>=0)
  // currentLeg=1 means leg 0 done → stop 1 is revealed (1>=1)
  function isRevealed(i: number) {
    if (!journeyStarted) return false
    if (journeyComplete) return true
    return currentLeg >= i
  }

  // Vehicle between stop i-1 and stop i, shown once stop i is revealed
  function getConnectorVehicle(i: number): Vehicle | null {
    if (!isRevealed(i) || i === 0) return null
    return getVehicle(
      stops[i - 1].years[0] === 0 ? undefined : stops[i - 1].years,
      difficulty,
      hardVehicle,
    )
  }

  const revealedCount = stops.filter((_, i) => isRevealed(i)).length

  return (
    <div className="bg-white/70 rounded-xl border border-map-border p-3">
      <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2.5 flex items-center justify-between">
        <span>Route Stops</span>
        <span className="font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
          {journeyStarted ? `${revealedCount}/${stops.length}` : `${stops.length} stops`}
        </span>
      </div>

      {!journeyStarted && (
        <div className="text-xs text-text-muted text-center py-3 italic">
          Start the journey to reveal stops…
        </div>
      )}

      <div className="space-y-0">
        {stops.map((stop, i) => {
          const revealed = isRevealed(i)
          const vehicle = getConnectorVehicle(i)
          if (!revealed) return null

          return (
            <div key={i} className="animate-fade-in">
              {/* Vehicle connector */}
              {i > 0 && (
                <div className="flex items-center gap-2 py-1 ml-2.5">
                  <div className="w-px h-3 bg-map-border flex-shrink-0" />
                  {vehicle ? (
                    <span className="text-sm leading-none">{getVehicleEmoji(vehicle)}</span>
                  ) : (
                    <div className="w-2 h-0.5 bg-map-border/60" />
                  )}
                </div>
              )}

              {/* Stop row */}
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-white ${
                  stop.isCollege ? 'bg-forest' : 'bg-ember'
                }`}>
                  {stop.isCollege ? '🎓' : i + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-text-warm leading-tight">{stop.city}</div>
                  {stop.isCollege && <div className="text-[10px] text-text-muted">College</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
