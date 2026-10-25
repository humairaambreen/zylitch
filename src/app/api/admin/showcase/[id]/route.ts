import { NextRequest, NextResponse } from 'next/server';
import { getShowcaseItemById, updateShowcaseItem, deleteShowcaseItem } from '@/lib/db';
import { deleteAsset } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const item = await getShowcaseItemById(numId);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Showcase item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();

    const updated = await updateShowcaseItem(numId, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Showcase item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error('Update showcase item failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const item = await getShowcaseItemById(numId);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Showcase item not found' }, { status: 404 });
    }

    // Clean up Cloudinary asset if applicable
    if (item.videoMp4 && item.videoMp4.includes('res.cloudinary.com')) {
      try {
        const parts = item.videoMp4.split('/upload/');
        if (parts[1]) {
          const publicWithExt = parts[1].replace(/^v\d+\//, '');
          const publicId = publicWithExt.replace(/\.[^/.]+$/, '');
          await deleteAsset(publicId, 'video');
        }
      } catch (e) {
        console.error('Cloudinary delete error:', e);
      }
    }

    const success = await deleteShowcaseItem(numId);
    return NextResponse.json({ success, message: 'Showcase item deleted' });
  } catch (error: any) {
    console.error('Delete showcase item failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
