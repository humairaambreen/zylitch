import { NextRequest, NextResponse } from 'next/server';
import { insertAnalyticsEvent } from '@/lib/db';
import { extractGeoLocation } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, eventType, durationSeconds, sessionId } = body;

    if (!projectId || !eventType) {
      return NextResponse.json(
        { success: false, error: 'Missing projectId or eventType' },
        { status: 400 }
      );
    }

    // Extract GeoIP using Vercel IP headers
    const geo = extractGeoLocation(req.headers);

    const eventId = await insertAnalyticsEvent({
      projectId,
      eventType,
      durationSeconds: Number(durationSeconds || 0),
      country: geo.country,
      region: geo.region,
      city: geo.city,
      sessionId: sessionId || undefined,
    });

    return NextResponse.json({ success: true, eventId, geo });
  } catch (error: any) {
    console.error('Failed to log analytics event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Analytics event ingestion failed' },
      { status: 500 }
    );
  }
}
