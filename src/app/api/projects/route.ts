import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/db';
import { translateProject } from '@/lib/translateService';
import { SupportedLocale } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const locale = (req.nextUrl.searchParams.get('locale') || req.headers.get('x-zylitch-locale') || 'en') as SupportedLocale;
    const rawProjects = await getAllProjects(false);

    if (locale && locale !== 'en') {
      const translatedProjects = await Promise.all(
        rawProjects.map((p) => translateProject(p, locale))
      );
      return NextResponse.json({ success: true, projects: translatedProjects });
    }

    return NextResponse.json({ success: true, projects: rawProjects });
  } catch (error: any) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
