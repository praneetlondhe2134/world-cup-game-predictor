import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  const { matchId } = params;

  return NextResponse.json({
    success: true,
    message: 'Match result endpoint reached',
    matchId,
  });
}