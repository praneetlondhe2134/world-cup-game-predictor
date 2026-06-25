import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      awayTeam: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
    orderBy: {
      kickoffTime: 'asc',
    },
  })

  return NextResponse.json({ success: true, matches })
}