import { NextResponse } from 'next/server'
import { getDailyPlayers, getPuzzleNumber } from '@/lib/daily'

export const dynamic = 'force-dynamic'

export async function GET() {
  const players = getDailyPlayers()
  const puzzleNumber = getPuzzleNumber()

  return NextResponse.json({
    puzzleNumber,
    players: players.map((p) => ({
      id: p.id,
      sport: p.sport,
      // Don't leak names to the client in a real deployment
      // This endpoint is for server-side rendering only
    })),
  })
}
