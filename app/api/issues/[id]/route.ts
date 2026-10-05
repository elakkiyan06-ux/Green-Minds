import { NextRequest, NextResponse } from 'next/server';
import { getIssueById, updateIssue } from '@/lib/store';
import { decodeSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issue = await getIssueById(id);

    if (!issue) {
      return NextResponse.json(
        { error: 'Environmental issue not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(issue);
  } catch (err: any) {
    console.error('API GET /api/issues/[id] error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve issue details.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Verify admin role for status changes, department assignment, or resolution notes
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const user = token ? decodeSessionToken(token) : null;

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { 
          error: 'Unauthorized: Administrator role is required to modify issue status, assign maintenance departments, or record resolution notes.' 
        },
        { status: 403 }
      );
    }

    const updated = await updateIssue(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: 'Environmental issue not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('API PATCH /api/issues/[id] error:', err);
    return NextResponse.json(
      { error: 'Failed to update issue.' },
      { status: 500 }
    );
  }
}
