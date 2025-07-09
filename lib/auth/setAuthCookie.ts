// setAuthCookie.ts
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { supabase } from '../supabase/client';
export function setAuthCookie(token: string) {
  return serialize('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

// Login route

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email en wachtwoord zijn verplicht' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session?.access_token) {
      return NextResponse.json({ error: error?.message || 'Inloggen mislukt' }, { status: 401 });
    }

    const cookie = setAuthCookie(data.session.access_token);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
