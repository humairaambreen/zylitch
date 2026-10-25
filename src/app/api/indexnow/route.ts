import { NextRequest, NextResponse } from 'next/server';
import { notifyIndexNow, SITE_URL } from '@/lib/seo';
import { getAllProjects } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let urls: string[] = body.urls;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      // Default to pinging all active project URLs and root
      const projects = await getAllProjects();
      urls = [
        SITE_URL,
        `${SITE_URL}/work`,
        ...projects.map((p) => `${SITE_URL}/work/${p.id}`),
      ];
    }

    const success = await notifyIndexNow(urls);
    return NextResponse.json({
      success,
      urlsPinged: urls.length,
      urls,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to notify IndexNow:', error);
    return NextResponse.json(
      { error: 'Failed to notify IndexNow' },
      { status: 500 }
    );
  }
}
