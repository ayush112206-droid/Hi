import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Browser Check (Chrome only)
  const userAgent = request.headers.get('user-agent') || '';
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(request.headers.get('vendor') || '');
  
  // We can't block strictly on server side because we want to show a popup, 
  // but we can add a header to let the client know.
  const response = NextResponse.next();
  response.headers.set('x-is-chrome', isChrome ? 'true' : 'false');

  // 2. Iframe Protection (X-Frame-Options)
  // Allow AI Studio preview environment and Netlify
  const isPreview = request.nextUrl.hostname.includes('run.app') || 
                    request.nextUrl.hostname.includes('localhost') ||
                    request.nextUrl.hostname.includes('vercel.app') ||
                    request.nextUrl.hostname.includes('personal.com');
  if (!isPreview) {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'none';");
  } else {
    // For preview, we must allow it to be framed
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://ai.studio https://*.google.com;");
  }

  return response;
}

export const config = {
  matcher: '/:path*',
};
