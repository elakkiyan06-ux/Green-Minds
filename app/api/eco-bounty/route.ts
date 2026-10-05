import { NextRequest, NextResponse } from 'next/server';
import { getEcoBountyStats, getEcoLeaderboard, getAllIssues } from '@/lib/store';
import { DEMO_ACHIEVEMENTS, DEMO_REWARDS } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get('period') as 'week' | 'month' | 'all') || 'all';

    const stats = getEcoBountyStats();
    const leaderboard = getEcoLeaderboard(period);
    const allIssues = await getAllIssues({ bountyOnly: true });

    return NextResponse.json({
      stats,
      leaderboard,
      myReports: allIssues.slice(0, 10),
      achievements: DEMO_ACHIEVEMENTS,
      rewards: DEMO_REWARDS,
    });
  } catch (err: any) {
    console.error('API /api/eco-bounty error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve Eco-Bounty data.' },
      { status: 500 }
    );
  }
}
