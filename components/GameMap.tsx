'use client'

import { useEffect, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { geoAlbersUsa } from 'd3-geo'
import { Player, Vehicle, Difficulty, ProjectedStop } from '@/lib/types'
import { getPlayerStops } from '@/lib/players'
import { getVehicle, getHardVehicle, buildPathD, getVehicleEmoji, getAnimDurationMs } from '@/lib/daily'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

// Map viewport dimensions — must match ComposableMap props
const MAP_W = 975
const MAP_H = 610
const MAP_SCALE = 1100

// Create the same projection that ComposableMap uses internally.
// ComposableMap(projection="geoAlbersUsa", width=975, height=610, projectionConfig={{ scale: 1100 }})
// internally calls: geoAlbersUsa().scale(1100).translate([width/2, height/2])
const projection = geoAlbersUsa()
  .scale(MAP_SCALE)
  .translate([MAP_W / 2, MAP_H / 2])

function project(coords: [number, number]): { x: number; y: number } | null {
  const result = projection(coords)
  if (!result || isNaN(result[0]) || isNaN(result[1])) return null
  return { x: result[0], y: result[1] }
}

interface GameMapProps {
  player: Player
  currentLeg: number
  difficulty: Difficulty
  ghostPlayers: Player[]
  onLegComplete: (legIndex: number) => void
  journeyStarted: boolean
}

export default function GameMap({
  player,
  currentLeg,
  difficulty,
  ghostPlayers,
  onLegComplete,
  journeyStarted,
}: GameMapProps) {
  // Project current player stops
  type ExtStop = ProjectedStop & { rawYears: [number, number] }
  const stops: ExtStop[] = getPlayerStops(player)
    .map((s) => {
      const pos = project(s.coords)
      if (!pos) return null
      return {
        teamName: s.teamName,
        city: s.city,
        x: pos.x,
        y: pos.y,
        years: s.years,
        isCollege: s.isCollege,
        rawYears: s.years,
      }
    })
    .filter((s): s is ExtStop => s !== null)

  // Build legs
  const hardVehicle = getHardVehicle(player.id)
  const legs = stops.slice(1).map((to, i) => {
    const from = stops[i]
    const vehicle = getVehicle(
      from.rawYears[0] === 0 ? undefined : from.rawYears,
      difficulty,
      hardVehicle,
    )
    return { from, to, vehicle, durationMs: getAnimDurationMs(vehicle) }
  })

  // Ghost path segments from wrong guesses
  type Seg = { x1: number; y1: number; x2: number; y2: number }
  const ghostSegs: Seg[] = ghostPlayers.flatMap((gp) => {
    const gStops = getPlayerStops(gp)
      .map((s) => project(s.coords))
      .filter((p): p is { x: number; y: number } => p !== null)
    return gStops.slice(1).map((to, i) => ({
      x1: gStops[i].x, y1: gStops[i].y,
      x2: to.x, y2: to.y,
    }))
  })

  return (
    <div
      className="map-container w-full bg-map-water rounded-xl overflow-hidden border-2 border-map-border shadow-inner"
      style={{ aspectRatio: `${MAP_W}/${MAP_H}` }}
    >
      <ComposableMap
        projection="geoAlbersUsa"
        width={MAP_W}
        height={MAP_H}
        projectionConfig={{ scale: MAP_SCALE }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Base geography */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAE4D5"
                stroke="#C0B09A"
                strokeWidth={0.6}
                style={{ outline: 'none' }}
              />
            ))
          }
        </Geographies>

        {/* Ghost paths — dashed gray for wrong guesses */}
        {ghostSegs.map((seg, i) => (
          <line
            key={`ghost-${ghostPlayers.length}-${i}`}
            x1={seg.x1} y1={seg.y1}
            x2={seg.x2} y2={seg.y2}
            stroke="#7A7A6A"
            strokeWidth={2.5}
            strokeDasharray="10 5"
            strokeLinecap="round"
            style={{ animation: 'ghostFade 0.6s ease forwards', opacity: 0 }}
          />
        ))}

        {/* Dashed track lines (shows all routes once journey starts) */}
        {journeyStarted && legs.map((leg, i) => (
          <path
            key={`track-${i}`}
            d={buildPathD(leg.from.x, leg.from.y, leg.to.x, leg.to.y, leg.vehicle)}
            fill="none"
            stroke="#C0B09A"
            strokeWidth={1.5}
            strokeDasharray="5 8"
            strokeOpacity={0.6}
          />
        ))}

        {/* Animated journey legs */}
        {legs.map((leg, i) => (
          <AnimatedLeg
            key={`${player.id}-leg-${i}`}
            legIndex={i}
            from={leg.from}
            to={leg.to}
            vehicle={leg.vehicle}
            durationMs={leg.durationMs}
            currentLeg={currentLeg}
            journeyStarted={journeyStarted}
            onComplete={() => onLegComplete(i)}
          />
        ))}

        {/* City markers — always on top */}
        {stops.map((stop, i) => (
          <CityMarker
            key={`${player.id}-marker-${i}`}
            x={stop.x}
            y={stop.y}
            index={i}
            city={stop.city}
            isCollege={stop.isCollege}
            isActive={journeyStarted && currentLeg === i - 1}
          />
        ))}
      </ComposableMap>
    </div>
  )
}

// ─── AnimatedLeg ──────────────────────────────────────────────

interface AnimatedLegProps {
  legIndex: number
  from: ProjectedStop
  to: ProjectedStop
  vehicle: Vehicle
  durationMs: number
  currentLeg: number
  journeyStarted: boolean
  onComplete: () => void
}

function AnimatedLeg({
  legIndex, from, to, vehicle, durationMs,
  currentLeg, journeyStarted, onComplete,
}: AnimatedLegProps) {
  const measRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(2000)
  const [pathAnimated, setPathAnimated] = useState(false)
  const completedRef = useRef(false)

  const [vehicleX, setVehicleX] = useState(from.x)
  const [vehicleY, setVehicleY] = useState(from.y)
  const [vehicleMoving, setVehicleMoving] = useState(false)

  const isActive = journeyStarted && currentLeg === legIndex
  const isComplete = journeyStarted && currentLeg > legIndex
  const durationS = durationMs / 1000
  const pathD = buildPathD(from.x, from.y, to.x, to.y, vehicle)

  // Measure path length via invisible reference path
  useEffect(() => {
    if (measRef.current) {
      const len = measRef.current.getTotalLength()
      if (len > 0) setPathLength(len)
    }
  }, [pathD])

  // Trigger animation on activation
  useEffect(() => {
    if (isActive) {
      completedRef.current = false
      setPathAnimated(false)
      setVehicleX(from.x)
      setVehicleY(from.y)
      setVehicleMoving(false)
      // Double rAF: paint initial state first, then trigger CSS transitions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPathAnimated(true)
          setVehicleMoving(true)
          setVehicleX(to.x)
          setVehicleY(to.y)
        })
      })
    }
    if (!isActive && !isComplete) {
      setPathAnimated(false)
      setVehicleMoving(false)
      completedRef.current = false
    }
  }, [isActive, isComplete]) // eslint-disable-line react-hooks/exhaustive-deps

  const showPath = isActive || isComplete

  return (
    <>
      {/* Invisible path for length measurement only */}
      <path ref={measRef} d={pathD} fill="none" stroke="none" opacity={0} />

      {/* Animated orange path */}
      {showPath && (
        <path
          d={pathD}
          fill="none"
          stroke="#D4621A"
          strokeWidth={3.5}
          strokeLinecap="round"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: isComplete ? 0 : pathAnimated ? 0 : pathLength,
            transition: isActive && pathAnimated
              ? `stroke-dashoffset ${durationS}s ease-in-out`
              : 'none',
          }}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'stroke-dashoffset' && isActive && !completedRef.current) {
              completedRef.current = true
              onComplete()
            }
          }}
        />
      )}

      {/* Vehicle emoji */}
      {isActive && (
        <g
          style={{
            transform: `translate(${vehicleX}px, ${vehicleY}px)`,
            transition: vehicleMoving
              ? `transform ${durationS}s ${vehicle === 'plane' ? 'ease-in-out' : 'linear'}`
              : 'none',
          }}
        >
          <circle cx={2} cy={2} r={15} fill="rgba(0,0,0,0.1)" />
          <rect x={-16} y={-16} width={32} height={32} rx={16} fill="white" stroke="#D4621A" strokeWidth={2} />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={18}
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {getVehicleEmoji(vehicle)}
          </text>
        </g>
      )}
    </>
  )
}

// ─── CityMarker ───────────────────────────────────────────────

function CityMarker({
  x, y, index, city, isCollege, isActive,
}: {
  x: number; y: number; index: number
  city: string; isCollege?: boolean; isActive: boolean
}) {
  const label = city.split(',')[0]
  const fill = isCollege ? '#2A7A4B' : '#D4621A'
  const r = index === 0 ? 10 : 8

  return (
    <g transform={`translate(${x},${y})`}>
      {isActive && (
        <circle fill="none" stroke={fill} strokeWidth={2}>
          <animate attributeName="r" values="12;22;12" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      <circle r={r} fill={fill} stroke="white" strokeWidth={2.5} />
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isCollege ? 10 : 9}
        fontWeight="700"
        fill="white"
        style={{ fontFamily: 'var(--font-mono)', userSelect: 'none', pointerEvents: 'none' }}
      >
        {isCollege ? '🎓' : String(index + 1)}
      </text>
      <text
        y={-(r + 7)}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        fill="#1C2B4A"
        stroke="white"
        strokeWidth={3}
        paintOrder="stroke"
        style={{ fontFamily: 'var(--font-sans)', userSelect: 'none', pointerEvents: 'none' }}
      >
        {label}
      </text>
    </g>
  )
}
