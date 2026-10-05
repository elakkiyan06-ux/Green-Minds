import { NextRequest, NextResponse } from 'next/server';
import { decodeSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const user = decodeSessionToken(token);
  return NextResponse.json({ user });
}
