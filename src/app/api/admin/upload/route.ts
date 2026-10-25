import { NextRequest, NextResponse } from 'next/server';
import { uploadVideo, uploadImage, isCloudinaryConfigured } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'video';
    const mode = ((formData.get('mode') as string) || 'raw') as 'raw' | 'compressed';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (type === 'poster') {
      const result = await uploadImage(buffer, file.name);
      return NextResponse.json({
        success: true,
        type: 'poster',
        ...result,
        cloudinaryConfigured: isCloudinaryConfigured(),
      });
    }

    // Video Upload with WebM auto-conversion and raw/compressed mode
    const result = await uploadVideo(buffer, file.name, mode);

    return NextResponse.json({
      success: true,
      type: 'video',
      ...result,
      cloudinaryConfigured: isCloudinaryConfigured(),
    });
  } catch (error: any) {
    console.error('Asset upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload processing failed' },
      { status: 500 }
    );
  }
}
