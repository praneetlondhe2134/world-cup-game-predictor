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

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  })

  if (!match) {
    return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 })
  }

  if (match.status === 'completed') {
    return NextResponse.json({ success: false, error: 'Cannot predict a completed match' }, { status: 400 })
  }

  if (predictedWinnerId !== undefined && predictedWinnerId !== null) {
    if (predictedWinnerId !== match.homeTeamId && predictedWinnerId !== match.awayTeamId) {
      return NextResponse.json({ success: false, error: 'predictedWinnerId must be a team playing in this match' }, { status: 400 })
    }
  }

 
  const trimmedDisplayName = displayName.trim()


  const existing = await prisma.prediction.findUnique({
    where: {
      matchId_displayName: {
        matchId,
        displayName: trimmedDisplayName,
      },
    },
  })


  if (existing) {
    return NextResponse.json({ success: false, error: 'You have already submitted a prediction for this match' }, { status: 409 })
  }


  const prediction = await prisma.prediction.create({
    data: {
      matchId,
      displayName: trimmedDisplayName,
      predictedWinnerId: predictedWinnerId ?? null,
      predictedHomeScore: predictedHomeScore ?? null,
      predictedAwayScore: predictedAwayScore ?? null,
    },
  })

  
  return NextResponse.json({ success: true, prediction }, { status: 201 })
}