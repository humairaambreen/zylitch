import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db';
import { deleteAsset } from '@/lib/cloudinary';
import { notifyIndexNow, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, project });
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
    const body = await req.json();

    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    notifyIndexNow([`${SITE_URL}/work/${id}`, `${SITE_URL}/work`]).catch(() => {});

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    console.error('Update project failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Attempt Cloudinary cleanup if it's a Cloudinary asset
    if (project.videoMp4.includes('res.cloudinary.com')) {
      try {
        const parts = project.videoMp4.split('/upload/');
        if (parts[1]) {
          const publicWithExt = parts[1].replace(/^v\d+\//, '');
          const publicId = publicWithExt.replace(/\.[^/.]+$/, '');
          await deleteAsset(publicId, 'video');
        }
      } catch (e) {
        console.error('Cloudinary delete error:', e);
      }
    }

    const success = await deleteProject(id);
    notifyIndexNow([`${SITE_URL}/work`]).catch(() => {});
    return NextResponse.json({ success, message: 'Project deleted' });
  } catch (error: any) {
    console.error('Delete project failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
