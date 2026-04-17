export type Sport = 'NBA' | 'NFL' | 'MLB' | 'NHL'
export type Vehicle = 'plane' | 'car' | 'hitchhike'
export type Difficulty = 'easy' | 'hard'
export type GamePhase = 'landing' | 'animating' | 'guessing' | 'revealed' | 'complete'

export interface TeamStop {
  teamName: string
  city: string
  coords: [number, number] // [longitude, latitude]
  years: [number, number]  // [start, end]
  isCollege?: boolean
}

export interface Player {
  id: string
  name: string
  sport: Sport
  college?: {
    name: string
    city: string
    coords: [number, number]
  }
  teams: TeamStop[]
}

export interface ProjectedStop {
  teamName: string
  city: string
  x: number
  y: number
  years: [number, number]
  isCollege?: boolean
}

export interface Leg {
  from: ProjectedStop
  to: ProjectedStop
  vehicle: Vehicle
  durationMs: number
}

export interface GhostPath {
  playerName: string
  stops: ProjectedStop[]
}

export interface GuessRecord {
  name: string
  correct: boolean
}

export interface PlayerResult {
  player: Player
  guesses: GuessRecord[]
  score: number
  solved: boolean
}

export interface GameState {
  puzzleNumber: number
  players: Player[]
  results: PlayerResult[]
  complete: boolean
}
