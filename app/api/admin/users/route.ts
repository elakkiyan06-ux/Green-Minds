import { NextRequest, NextResponse } from 'next/server';
import { decodeSessionToken, getAllCampusUsers, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = token ? decodeSessionToken(token) : null;

  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized: Admin privileges required to view campus user roster.' },
      { status: 403 }
    );
  }

  const users = getAllCampusUsers();
  return NextResponse.json(users);
}
