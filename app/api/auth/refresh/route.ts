// /app/api/auth/refresh/route.ts
import { createSupabaseServerClient } from '@/lib/supabase/serverClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookies = req.headers.get('cookie') || '';
  const refreshToken = cookies
    .split('; ')
    .find((c) => c.startsWith('refresh_token='))
    ?.split('=')[1];

  if (!refreshToken) {
    return NextResponse.json({ error: 'Geen refresh_token' }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error || !data.session) {
    return NextResponse.json({ error: 'Verversen mislukt' }, { status: 401 });
  }

  const { access_token, expires_in } = data.session;

  const res = NextResponse.json({ success: true });

  res.cookies.set('access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: expires_in,
  });

  return res;
}
