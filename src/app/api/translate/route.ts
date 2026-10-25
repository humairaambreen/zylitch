import { NextRequest, NextResponse } from 'next/server';
import { translateText, translateProject } from '@/lib/translateService';
import { SupportedLocale, SUPPORTED_LOCALES } from '@/lib/seo';
import { WorkPin } from '@/lib/defaultPins';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, text, texts, project } = body;

    const locale = (to || 'en') as SupportedLocale;
    if (!SUPPORTED_LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
    }

    // 1. Single text translation
    if (typeof text === 'string') {
      const translated = await translateText(text, locale);
      return NextResponse.json({ translated });
    }

    // 2. Batch texts translation
    if (Array.isArray(texts)) {
      const translated = await Promise.all(texts.map((t: string) => translateText(t, locale)));
      return NextResponse.json({ translated });
    }

    // 3. Full project translation
    if (project && typeof project === 'object') {
      const translated = await translateProject(project as WorkPin, locale);
      return NextResponse.json({ project: translated });
    }

    return NextResponse.json({ error: 'Missing text, texts, or project in request body' }, { status: 400 });
  } catch (err: any) {
    console.error('[API /api/translate] error:', err);
    return NextResponse.json({ error: err.message || 'Translation failed' }, { status: 500 });
  }
}
