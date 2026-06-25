import { NextRequest, NextResponse } from 'next/server'

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

  return NextResponse.json({
    success: true,
    message: 'Prediction endpoint reached',
    received: body,
  })
}