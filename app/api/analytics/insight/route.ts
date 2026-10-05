import { NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/store';
import { generateAnalyticsInsight } from '@/lib/gemini';

export async function POST() {
  try {
    const data = await getAnalyticsData();

    const summaryText = `
Total Environmental Issues: ${data.totalIssues}
Resolved Issues: ${data.resolvedIssues} (${data.resolutionRate}%)
Open/In Progress Issues: ${data.openIssues + data.inProgressIssues}
Current Campus Green Score: ${data.greenScore} / 100

Category Breakdown:
${data.categoryCounts.map(c => `- ${c.label}: ${c.count} incidents`).join('\n')}

Severity Breakdown:
${data.severityCounts.map(s => `- ${s.severity}: ${s.count} incidents`).join('\n')}

Frequent Locations:
${data.locationCounts.slice(0, 5).map(l => `- ${l.location}: ${l.count} incidents`).join('\n')}
`;

    const insight = await generateAnalyticsInsight(summaryText);

    return NextResponse.json({ insight });
  } catch (err: any) {
    console.error('API /api/analytics/insight error:', err);
    return NextResponse.json(
      { error: 'Failed to generate analytics insight.' },
      { status: 500 }
    );
  }
}
