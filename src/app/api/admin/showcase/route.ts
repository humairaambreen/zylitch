import { NextRequest, NextResponse } from 'next/server';
import { getAllShowcaseItems, createShowcaseItem } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getAllShowcaseItems(true);
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Admin fetch showcase items failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch showcase items' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      titleTop,
      titleBottom,
      leftTitle,
      leftText,
      rightTitle,
      rightText,
      videoWebm,
      videoMp4,
      posterSrc,
      videoSrc,
      width,
      height,
      sortOrder,
      isActive,
    } = body;

    if (!titleTop || !titleBottom || !videoMp4) {
      return NextResponse.json(
        { success: false, error: 'Top Title, Bottom Title, and Video are required' },
        { status: 400 }
      );
    }

    const newItem = await createShowcaseItem({
      id: typeof id === 'number' ? id : undefined as any,
      titleTop,
      titleBottom,
      leftTitle: leftTitle || '',
      leftText: leftText || '',
      rightTitle: rightTitle || '',
      rightText: rightText || '',
      videoWebm: videoWebm || videoMp4,
      videoMp4,
      posterSrc: posterSrc || '/assets/burger-promo-poster.webp',
      videoSrc: videoSrc || videoMp4,
      width: Number(width) || 720,
      height: Number(height) || 1280,
      sortOrder: Number(sortOrder || 0),
      isActive: isActive !== false,
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('Admin create showcase item failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create showcase item' },
      { status: 500 }
    );
  }
}
