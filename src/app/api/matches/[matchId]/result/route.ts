import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculatePoints } from '@/lib/scoring';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
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

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore,
      awayScore,
      status: 'completed',
    },
  });

  const predictions = await prisma.prediction.findMany({
    where: { matchId },
  });

  let scoredCount = 0;
  for (const prediction of predictions) {
    const points = calculatePoints(
      homeScore,
      awayScore,
      prediction.predictedWinnerId,
      match.homeTeamId,
      match.awayTeamId,
      prediction.predictedHomeScore,
      prediction.predictedAwayScore,
    );

    await prisma.prediction.update({
      where: { id: prediction.id },
      data: { pointsAwarded: points },
    });

    scoredCount++;
  }

  return NextResponse.json({
    success: true,
    match: updatedMatch,
    predictionsScored: scoredCount,
  });
}