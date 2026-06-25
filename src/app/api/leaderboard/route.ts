import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const grouped = await prisma.prediction.groupBy({
    by: ['displayName'],
    _sum: {
      pointsAwarded: true,
    },
    _count: {
      id: true,
    },
    orderBy: [
      { _sum: { pointsAwarded: 'desc' } },
      { _count: { id: 'desc' } },
      { displayName: 'asc' },
    ],
  })

  const leaderboard = grouped.map((entry) => ({
    displayName: entry.displayName,
    totalPoints: entry._sum.pointsAwarded ?? 0,
    predictionCount: entry._count.id,
  }))

  return NextResponse.json({ success: true, leaderboard })
}