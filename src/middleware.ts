import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LOCALES, SupportedLocale } from '@/lib/seo';

const LOCALES_SET = new Set<string>(['ko', 'ja', 'es', 'fr', 'de', 'ru']);

const COUNTRY_TO_LOCALE: Record<string, SupportedLocale> = {
  KR: 'ko',
  KP: 'ko',
  JP: 'ja',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  GT: 'es',
  CU: 'es',
  BO: 'es',
  DO: 'es',
  HN: 'es',
  PY: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PA: 'es',
  UY: 'es',
  FR: 'fr',
  BE: 'fr',
  CH: 'fr',
  DE: 'de',
  AT: 'de',
  RU: 'ru',
  BY: 'ru',
  KZ: 'ru',
};

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Ignore static assets, next internal files, api routes, feeds, and sitemaps
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/lottie') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/video-sitemap.xml' ||
    pathname === '/feed.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname === '/manifest.webmanifest'
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // 1. Language subpath detected: e.g. /ko, /ko/work, /ko/work/pin-1
  if (firstSegment && LOCALES_SET.has(firstSegment)) {
    const locale = firstSegment as SupportedLocale;
    const remainingPath = '/' + segments.slice(1).join('/');
    const targetUrl = new URL(remainingPath + search, request.url);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-zylitch-locale', locale);
    requestHeaders.set('x-zylitch-path', remainingPath);

    const response = NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.cookies.set('zylitch_locale', locale, { path: '/', maxAge: 31536000, sameSite: 'lax' });

    return response;
  }

  // 2. Root visit without subpath: check Vercel GeoIP country header for automatic routing
  const cookieLocale = request.cookies.get('zylitch_locale')?.value;
  const vercelCountry = request.headers.get('x-vercel-ip-country')?.toUpperCase();

  // If user visits root / and has no explicit cookie, auto-redirect if from a supported country
  if (pathname === '/' && !cookieLocale && vercelCountry && COUNTRY_TO_LOCALE[vercelCountry]) {
    const matchedLocale = COUNTRY_TO_LOCALE[vercelCountry];
    if (matchedLocale !== 'en' && LOCALES_SET.has(matchedLocale)) {
      const redirectUrl = new URL(`/${matchedLocale}${search}`, request.url);
      const res = NextResponse.redirect(redirectUrl);
      res.cookies.set('zylitch_locale', matchedLocale, { path: '/', maxAge: 31536000, sameSite: 'lax' });
      return res;
    }
  }

  // Default passthrough with security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
