import { NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/store';

export async function GET() {
  try {
    const data = await getAnalyticsData();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API GET /api/analytics error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics data.' },
      { status: 500 }
    );
  }
}
