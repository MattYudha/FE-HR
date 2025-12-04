import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // PERBAIKAN: Ganti 'auth_token' menjadi 'token' sesuai dengan auth-context.tsx
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Jika user sudah login (ada token) dan mencoba akses halaman login, lempar ke dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika user belum login (tidak ada token) dan mencoba akses halaman selain login/public, lempar ke login
  // Kecuali halaman register jika Anda punya routenya di sini
  if (
    pathname !== '/login' &&
    pathname !== '/register' &&
    pathname !== '/' &&
    !token
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/employees/:path*',
    '/payroll/:path*',
    '/kpi/:path*',
    '/approval/:path*',
    '/attendance/:path*',
    '/login',
  ],
};
