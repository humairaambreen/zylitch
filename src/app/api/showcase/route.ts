import { NextRequest, NextResponse } from 'next/server';
import { getAllShowcaseItems } from '@/lib/db';
import { PORTFOLIO_ITEMS, PortfolioItem } from '@/data/portfolio';
import { translateShowcaseItem } from '@/lib/translateService';
import { SupportedLocale } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const locale = (req.nextUrl.searchParams.get('locale') || req.headers.get('x-zylitch-locale') || 'en') as SupportedLocale;
    const dbItems = await getAllShowcaseItems(false);
    const items: PortfolioItem[] = (dbItems as PortfolioItem[]) || [];

    if (locale && locale !== 'en') {
      const translatedItems = await Promise.all(
        items.map((item) => translateShowcaseItem(item, locale))
      );
      return NextResponse.json({ success: true, items: translatedItems });
    }

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Failed to fetch showcase items:', error);
    return NextResponse.json({ success: false, items: [], error: error.message }, { status: 500 });
  }
}
