'use client'

import { Player, Vehicle, Difficulty } from '@/lib/types'
import { getPlayerStops } from '@/lib/players'
import { getVehicle, getHardVehicle, getVehicleEmoji } from '@/lib/daily'

interface StopListProps {
  player: Player
  revealedUpTo: number  // how many stops have been animated through (-1 = none, 0 = first stop visible, etc.)
  difficulty: Difficulty
  journeyStarted: boolean
}

export default function StopList({ player, revealedUpTo, difficulty, journeyStarted }: StopListProps) {
  const stops = getPlayerStops(player)
  const hardVehicle = getHardVehicle(player.id)

  return (
    <div className="bg-white/70 rounded-xl border border-map-border p-3">
      <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2.5">
        Route Stops · {stops.length} cities
      </div>
      <div className="space-y-0">
        {stops.map((stop, i) => {
          const isRevealed = !journeyStarted || i <= revealedUpTo
          let vehicle: Vehicle | null = null
          if (i > 0 && journeyStarted && i <= revealedUpTo) {
            vehicle = getVehicle(
              stops[i - 1].years[0] === 0 ? undefined : stops[i - 1].years,
              difficulty,
              hardVehicle,
            )
          }

          return (
            <div key={i}>
              {/* Vehicle connector between stops */}
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
              <div className={`flex items-center gap-2 transition-opacity duration-300 ${isRevealed ? 'opacity-100' : 'opacity-40'}`}>
                {/* Marker dot */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-white ${
                  stop.isCollege ? 'bg-forest' : i <= revealedUpTo || !journeyStarted ? 'bg-ember' : 'bg-map-border'
                }`}>
                  {stop.isCollege ? '🎓' : i + 1}
                </div>

                {/* City info */}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-text-warm leading-tight">
                    {stop.city}
                  </div>
                  {stop.isCollege && (
                    <div className="text-[10px] text-text-muted">College</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
