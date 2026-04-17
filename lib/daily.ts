import { Player, Vehicle, Difficulty } from './types'
import { ALL_PLAYERS } from './players'

// Day 1 = Jan 1, 2025
const DAY_ONE = new Date('2025-01-01T00:00:00Z').getTime()

export function getPuzzleNumber(): number {
  return Math.floor((Date.now() - DAY_ONE) / (1000 * 60 * 60 * 24)) + 1
}

export function getDailyPlayers(): Player[] {
  const puzzleNum = getPuzzleNumber()
  const count = 5
  const result: Player[] = []
  for (let i = 0; i < count; i++) {
    result.push(ALL_PLAYERS[(puzzleNum - 1 + i) % ALL_PLAYERS.length])
  }
  return result
}

export function getScoreForGuesses(guessCount: number, failed: boolean): number {
  if (failed) return 0
  const scores = [500, 400, 300, 200, 100]
  return scores[Math.min(guessCount - 1, scores.length - 1)] ?? 0
}

export function getVehicle(
  yearsAtPreviousStop: [number, number] | undefined,
  difficulty: Difficulty,
  playerHardVehicle?: Vehicle,
): Vehicle {
  if (difficulty === 'hard') {
    return playerHardVehicle ?? 'car'
  }
  // Easy mode: tenure-based hint
  if (!yearsAtPreviousStop || yearsAtPreviousStop[0] === 0) return 'car' // college → first team
  const tenure = yearsAtPreviousStop[1] - yearsAtPreviousStop[0]
  if (tenure >= 5) return 'hitchhike'
  if (tenure >= 2) return 'car'
  return 'plane'
}

export function getVehicleEmoji(vehicle: Vehicle): string {
  switch (vehicle) {
    case 'plane': return '✈️'
    case 'car': return '🚗'
    case 'hitchhike': return '🪧'
  }
}

export function getVehicleLabel(vehicle: Vehicle): string {
  switch (vehicle) {
    case 'plane': return 'Quick stop — flew out'
    case 'car': return 'Mid-length stint'
    case 'hitchhike': return 'Long tenure — hitched a ride'
  }
}

export function getAnimDurationMs(vehicle: Vehicle): number {
  switch (vehicle) {
    case 'plane': return 1200
    case 'car': return 2000
    case 'hitchhike': return 2800
  }
}

// For hard mode, assign a random vehicle per player (deterministic by player id)
export function getHardVehicle(playerId: string): Vehicle {
  const hash = playerId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const vehicles: Vehicle[] = ['plane', 'car', 'hitchhike']
  return vehicles[hash % 3]
}

// Build a curved SVG path for planes, straight for others
export function buildPathD(
  x1: number, y1: number,
  x2: number, y2: number,
  vehicle: Vehicle,
): string {
  if (vehicle === 'plane') {
    const cpx = (x1 + x2) / 2
    const cpy = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.35 - 40
    return `M ${x1},${y1} Q ${cpx},${cpy} ${x2},${y2}`
  }
  return `M ${x1},${y1} L ${x2},${y2}`
}

// Color per sport
export function getSportColor(sport: string): string {
  switch (sport) {
    case 'NBA': return '#D4621A'
    case 'NFL': return '#2A7A4B'
    case 'MLB': return '#1C2B4A'
    case 'NHL': return '#B93232'
    default: return '#D4621A'
  }
}

export function getSportBadgeStyle(sport: string): string {
  switch (sport) {
    case 'NBA': return 'bg-ember text-white'
    case 'NFL': return 'bg-forest text-white'
    case 'MLB': return 'bg-navy text-white'
    case 'NHL': return 'bg-danger text-white'
    default: return 'bg-ember text-white'
  }
}

// Generate share text
export function buildShareText(
  puzzleNumber: number,
  results: Array<{ score: number; solved: boolean; guesses: Array<{ name: string; correct: boolean }> }>,
): string {
  const total = results.reduce((sum, r) => sum + r.score, 0)
  const maxScore = results.length * 500

  const lines = results.map((r, i) => {
    if (r.solved) {
      const guessNum = r.guesses.length
      const emoji = guessNum === 1 ? '🏆' : guessNum <= 2 ? '✅' : '🟡'
      return `${emoji} Player ${i + 1}: Guess ${guessNum} (${r.score}pts)`
    } else {
      return `❌ Player ${i + 1}: Failed (0pts)`
    }
  })

  return [
    `Road Trip Roster #${puzzleNumber} 🚗`,
    `Score: ${total}/${maxScore}`,
    '',
    ...lines,
    '',
    'roadtriproster.vercel.app',
  ].join('\n')
}

// Normalize player names for comparison (strip accents, lowercase)
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim()
}
