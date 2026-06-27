import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  const { matchId } = await params;

  if (!matchId) {
    return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
  }

  const body = await request.json();
  const { homeScore, awayScore } = body;

  if (homeScore === undefined || homeScore === null) {
    return NextResponse.json({ error: 'homeScore is required' }, { status: 400 });
  }

  if (awayScore === undefined || awayScore === null) {
    return NextResponse.json({ error: 'awayScore is required' }, { status: 400 });
  }

  if (typeof homeScore !== 'number' || typeof awayScore !== 'number') {
    return NextResponse.json({ error: 'Scores must be numbers' }, { status: 400 });
  }

  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
    return NextResponse.json({ error: 'Scores must be whole numbers' }, { status: 400 });
  }

  if (homeScore < 0 || awayScore < 0) {
    return NextResponse.json({ error: 'Scores must be 0 or greater' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: 'Validation passed',
    matchId,
    homeScore,
    awayScore,
  });
}