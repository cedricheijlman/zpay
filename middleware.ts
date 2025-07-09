import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const CSRF_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];
const PUBLIC_ROUTES = ['/', '/login', '/register', '/contact'];
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

// ✅ CSRF-token genereren zonder Node.js import (Edge Web Crypto API)
function generateCsrfToken(): string {
  return crypto.randomUUID();
}

// ✅ JWT verifier
async function verifyJwt(token: string) {
  const encoder = new TextEncoder();
  const { payload } = await jwtVerify(token, encoder.encode(SUPABASE_JWT_SECRET));
  return payload;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  const isApiRoute = pathname.startsWith('/api');
  const isMutating = CSRF_METHODS.includes(method);
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isStaticAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images');

  // ⛔ Skip static assets
  if (isStaticAsset) return NextResponse.next();

  const accessToken = req.cookies.get('access_token')?.value;
  const csrfCookie = req.cookies.get('csrf_token')?.value;
  const csrfHeader = req.headers.get('x-csrf-token');

  const res = NextResponse.next();

  // ✅ Zet CSRF-token als deze ontbreekt
  if (!csrfCookie) {
    const newToken = generateCsrfToken();
    res.cookies.set('csrf_token', newToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 uur
    });
  }

  // 🔐 Redirect ingelogde gebruikers weg van /login of /register
  if (accessToken && isAuthPage) {
    try {
      await verifyJwt(accessToken);
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } catch {
      // Token ongeldig → laat doorgaan naar login/register
    }
  }

  // 🔒 CSRF check voor API-mutaties
  if (isApiRoute && isMutating) {
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return NextResponse.json(
        { error: 'Er is een fout opgelopen. Probeer later opnieuw.' },
        { status: 403 }
      );
    }
  }

  const isProtectedPage = !isPublic && !isApiRoute;

  // 🔐 Geen token op protected page → redirect naar login
  if (isProtectedPage && !accessToken) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🔐 Token aanwezig → verifieer JWT
  if (isProtectedPage && accessToken) {
    try {
      await verifyJwt(accessToken);
    } catch {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

// ✅ Matcht alles behalve static assets
export const config = {
  matcher: ['/((?!_next/|favicon.ico|logo|fonts|images).*)'],
};
