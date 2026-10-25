import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_PASS = process.env.ADMIN_PASSWORD;
const AUTH_COOKIE = 'zylitch_admin_auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!ADMIN_PASS) {
      return NextResponse.json({ success: false, error: 'ADMIN_PASSWORD environment variable is not configured' }, { status: 500 });
    }

    if (password === ADMIN_PASS) {
      const response = NextResponse.json({ success: true, message: 'Authenticated' });
      response.cookies.set(AUTH_COOKIE, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Incorrect passphrase' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Auth failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(AUTH_COOKIE);
  const isAuthenticated = cookie?.value === 'authenticated';
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete(AUTH_COOKIE);
  return response;
}
