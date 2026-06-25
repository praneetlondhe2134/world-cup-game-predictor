import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { matchId, displayName, predictedHomeScore, predictedAwayScore, predictedWinnerId } = body

  if (!matchId) {
    return NextResponse.json({ success: false, error: 'matchId is required' }, { status: 400 })
  }

  if (!displayName || typeof displayName !== 'string') {
    return NextResponse.json({ success: false, error: 'displayName is required and must be a string' }, { status: 400 })
  }

  if (displayName.trim() === '') {
    return NextResponse.json({ success: false, error: 'displayName cannot be empty' }, { status: 400 })
  }

  if (predictedHomeScore !== undefined && typeof predictedHomeScore !== 'number') {
    return NextResponse.json({ success: false, error: 'predictedHomeScore must be a number' }, { status: 400 })
  }

  if (predictedAwayScore !== undefined && typeof predictedAwayScore !== 'number') {
    return NextResponse.json({ success: false, error: 'predictedAwayScore must be a number' }, { status: 400 })
  }

  if (predictedWinnerId !== undefined && predictedWinnerId !== null && typeof predictedWinnerId !== 'string') {
    return NextResponse.json({ success: false, error: 'predictedWinnerId must be a string or null' }, { status: 400 })
  }

  // 1. Find the match by matchId
  const match = await prisma.match.findUnique({
    where: { id: matchId },
  })

  // 2. If no match exists, return error
  if (!match) {
    return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 })
  }

  // 3. If match is completed, return error
  if (match.status === 'completed') {
    return NextResponse.json({ success: false, error: 'Cannot predict a completed match' }, { status: 400 })
  }

  // 4. If predictedWinnerId is provided, it must be one of the two teams
  if (predictedWinnerId !== undefined && predictedWinnerId !== null) {
    if (predictedWinnerId !== match.homeTeamId && predictedWinnerId !== match.awayTeamId) {
      return NextResponse.json({ success: false, error: 'predictedWinnerId must be a team playing in this match' }, { status: 400 })
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Prediction endpoint reached',
    received: body,
  })
}