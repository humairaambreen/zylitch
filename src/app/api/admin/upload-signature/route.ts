import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { isCloudinaryConfigured } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary credentials are not configured on the server' },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: 'Missing Cloudinary configuration' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const resourceType = body.resourceType === 'image' ? 'image' : 'video';
    const folder = body.folder || (resourceType === 'image' ? 'zylitch/posters' : 'zylitch/videos');
    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign: Record<string, any> = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      success: true,
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
      resourceType,
    });
  } catch (error: any) {
    console.error('Signature generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Signature generation failed' },
      { status: 500 }
    );
  }
}
