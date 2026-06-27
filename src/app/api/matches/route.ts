import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { predictMatch } from '@/lib/predictor';

export async function GET() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: {
        select: {
          id: true,
          name: true,
          code: true,
          rating: true,
        },
      },
      awayTeam: {
        select: {
          id: true,
          name: true,
          code: true,
          rating: true,
        },
      },
    },
    orderBy: {
      kickoffTime: 'asc',
    },
  });

  const matchesWithPredictions = matches.map(match => ({
    ...match,
    appPrediction: predictMatch(
      match.homeTeam.name,
      match.homeTeam.rating,
      match.awayTeam.name,
      match.awayTeam.rating,
    ),
  }));

  return NextResponse.json({ success: true, matches: matchesWithPredictions });
}