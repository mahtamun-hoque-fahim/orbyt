import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// Public routes that never require a session
const PUBLIC_PATHS = ['/', '/login', '/signup']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Let Next.js internals and auth API through unconditionally
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/push') ||
    pathname.startsWith('/api/cron') ||
    pathname === '/favicon.ico' ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.ico') ||
    pathname === '/sw.js'
  ) {
    return NextResponse.next()
  }

  // Public pages: redirect to dashboard if already signed in
  if (PUBLIC_PATHS.includes(pathname)) {
    const session = getSessionCookie(request)
    if (session && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // All other routes require a session
  const session = getSessionCookie(request)
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files.
     * getSessionCookie is a cookie-only check — no DB round trip.
     * Real session validation happens inside Server Components and Route Handlers.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
