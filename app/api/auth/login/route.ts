import { NextResponse } from 'next/server';
import { loginSchema, LoginSchema } from '@/lib/schemas/loginSchema';
import { createSupabaseServerClient } from '@/lib/supabase/serverClient';
import { parse } from 'cookie';

// api/login/route.ts
export async function POST(req: Request) {
  const csrfHeader = req.headers.get('x-csrf-token');

  const cookieHeader = req.headers.get('cookie') || '';
  const csrfCookie = parse(cookieHeader)['csrf_token'];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  try {
    // Parse en valideer de body
    const body = await req.json();
    const parse = loginSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        {
          error: 'Ongeldige invoer',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = parse.data;

    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: 'Inloggen mislukt. Controleer je gegevens.', statusCode: 401 },
        { status: 401 }
      );
    }

    const { access_token, refresh_token, expires_in, user } = data.session;

    // 5. Klaar: Supabase heeft HTTP-only cookie gezet
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
      },
      token: {
        access_token: access_token,
        expires_in: expires_in,
        token_type: 'bearer',
      },
    });

    // ✅ Zet cookie JWT
    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expires_in,
    });

    // Zet cookie JWT [-] Refresh Token
    response.cookies.set('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14, // bijv. 14 dagen
    });

    return response;
  } catch (err) {
    console.error('[Login Error]', err);
    return NextResponse.json(
      { error: 'Interne serverfout tijdens inloggen.', statusCode: 500 },
      { status: 500 }
    );
  }
}
