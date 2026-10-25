import { NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const summary = await getAnalyticsSummary();
    return NextResponse.json({ success: true, ...summary });
  } catch (error: any) {
    console.error('Failed to get analytics summary:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get analytics summary' },
      { status: 500 }
    );
  }
}
