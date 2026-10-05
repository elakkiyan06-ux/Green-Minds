import { NextRequest, NextResponse } from 'next/server';
import { askGreenMindAssistant } from '@/lib/gemini';
import { getAllIssues } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || question.trim() === '') {
      return NextResponse.json(
        { error: 'Question is required.' },
        { status: 400 }
      );
    }

    // Retrieve recent campus issues to provide as context
    const issues = await getAllIssues();
    const topIssuesSummary = issues.slice(0, 10).map((i, index) => 
      `${index + 1}. [${i.status.toUpperCase()}] ${i.title} at ${i.location} (Category: ${i.category}, Severity: ${i.severity})`
    ).join('\n');

    const campusContext = `
Campus Environmental Incident Log Summary:
Total Issues Reported: ${issues.length}
Open/In Progress Issues: ${issues.filter(i => i.status !== 'resolved').length}
Resolved Issues: ${issues.filter(i => i.status === 'resolved').length}

Recent Incidents:
${topIssuesSummary}
`;

    const assistantResponse = await askGreenMindAssistant(question, campusContext, issues);

    return NextResponse.json(assistantResponse);
  } catch (err: any) {
    console.error('API /api/assistant error:', err);
    return NextResponse.json(
      { error: "GreenMind couldn't process your question. Please try again." },
      { status: 500 }
    );
  }
}
