import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

export interface UploadResult {
  videoMp4: string;
  videoWebm: string;
  poster: string;
  publicId: string;
  mode: 'raw' | 'compressed';
  storage: 'cloudinary' | 'local';
}

export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return Boolean(cloudName && apiKey && apiSecret);
}

function initCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
}

/**
 * Upload video buffer to Cloudinary with automatic WebM conversion,
 * high-fidelity audio retention, and Raw vs Compressed quality modes.
 */
export async function uploadVideo(
  buffer: Buffer,
  filename: string,
  mode: 'raw' | 'compressed' = 'raw'
): Promise<UploadResult> {
  if (isCloudinaryConfigured()) {
    initCloudinary();
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: 'video',
        folder: 'zylitch/videos',
        overwrite: true,
        use_filename: true,
        unique_filename: true,
      };

      if (mode === 'raw') {
        // Retain uncompromised master quality and uncompressed audio fidelity
        uploadOptions.quality_analysis = true;
      } else {
        // Balanced compression for faster streaming
        uploadOptions.quality = 'auto:good';
      }

      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'));
        }

        const publicId = result.public_id;
        const version = result.version ? `v${result.version}/` : '';

        // Auto WebM conversion URL with VP9 codec preserving high audio & video quality
        const qualityParam = mode === 'raw' ? 'q_auto:best' : 'q_auto:good';
        const videoWebm = `https://res.cloudinary.com/${cloudName}/video/upload/${qualityParam},vc_vp9/${version}${publicId}.webm`;

        // Direct high-quality MP4 URL
        const videoMp4 = mode === 'raw'
          ? result.secure_url
          : `https://res.cloudinary.com/${cloudName}/video/upload/q_auto:good,vc_auto/${version}${publicId}.mp4`;

        // Auto-generated 1st frame high quality poster
        const poster = `https://res.cloudinary.com/${cloudName}/video/upload/so_0,f_webp,${qualityParam}/${version}${publicId}.webp`;

        resolve({
          videoMp4,
          videoWebm,
          poster,
          publicId,
          mode,
          storage: 'cloudinary',
        });
      });

      stream.end(buffer);
    });
  }

  // Local storage fallback for development when credentials aren't set
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = path.join(uploadsDir, safeName);
  fs.writeFileSync(filePath, buffer);

  const localUrl = `/uploads/${safeName}`;
  return {
    videoMp4: localUrl,
    videoWebm: localUrl,
    poster: '/assets/burger-promo-poster.webp',
    publicId: safeName,
    mode,
    storage: 'local',
  };
}

/**
 * Upload an image or custom poster to Cloudinary
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string
): Promise<{ url: string; publicId: string; storage: 'cloudinary' | 'local' }> {
  if (isCloudinaryConfigured()) {
    initCloudinary();

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'zylitch/posters',
          format: 'webp',
          quality: 'auto:best',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Image upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            storage: 'cloudinary',
          });
        }
      );
      stream.end(buffer);
    });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeName = `poster-${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = path.join(uploadsDir, safeName);
  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${safeName}`,
    publicId: safeName,
    storage: 'local',
  };
}

/**
 * Delete a media asset from Cloudinary
 */
export async function deleteAsset(publicId: string, resourceType: 'video' | 'image' = 'video'): Promise<boolean> {
  if (!publicId) return false;

  if (isCloudinaryConfigured()) {
    initCloudinary();
    try {
      const res = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return res.result === 'ok';
    } catch (e) {
      console.error('Cloudinary destroy error:', e);
      return false;
    }
  }

  // Local file cleanup
  try {
    const filePath = path.join(process.cwd(), 'public', 'uploads', publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (e) {
    console.error('Local unlink error:', e);
  }
  return false;
}
