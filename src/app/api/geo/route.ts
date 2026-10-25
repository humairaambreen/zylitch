import { NextRequest, NextResponse } from 'next/server';
import { SupportedLocale, SUPPORTED_LOCALES } from '@/lib/seo';

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
  CA: 'en', // Canada default EN, though FR also present
  DE: 'de',
  AT: 'de',
  RU: 'ru',
  BY: 'ru',
  KZ: 'ru',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryGeo = searchParams.get('geo')?.toUpperCase();
  const queryLang = searchParams.get('lang')?.toLowerCase();

  // 1. Check explicit testing parameter
  if (queryLang && SUPPORTED_LOCALES.includes(queryLang as SupportedLocale)) {
    return NextResponse.json({
      success: true,
      country: queryGeo || 'CUSTOM',
      city: 'Custom',
      locale: queryLang as SupportedLocale,
    });
  }

  // 2. Read Vercel Edge GeoIP Headers
  const country = queryGeo || request.headers.get('x-vercel-ip-country')?.toUpperCase() || 'US';
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
  const region = request.headers.get('x-vercel-ip-country-region') || 'Unknown';

  const resolvedLocale: SupportedLocale = COUNTRY_TO_LOCALE[country] || 'en';

  return NextResponse.json({
    success: true,
    country,
    city,
    region,
    locale: resolvedLocale,
  });
}
