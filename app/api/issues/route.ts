import { NextRequest, NextResponse } from 'next/server';
import { getAllIssues, createIssue } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const severity = searchParams.get('severity') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const location = searchParams.get('location') || undefined;
    const search = searchParams.get('search') || undefined;

    const issues = await getAllIssues({
      severity,
      category,
      status,
      location,
      search,
    });

    return NextResponse.json(issues);
  } catch (err: any) {
    console.error('API GET /api/issues error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve environmental issues.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.location) {
      return NextResponse.json(
        { error: 'Missing required issue properties (title, location).' },
        { status: 400 }
      );
    }

    const created = await createIssue(body);

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('API POST /api/issues error:', err);
    return NextResponse.json(
      { error: 'Failed to save environmental issue.' },
      { status: 500 }
    );
  }
}
