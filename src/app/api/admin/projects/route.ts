import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db';
import { notifyIndexNow, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await getAllProjects(true);
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error('Admin fetch projects failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      category,
      categoryLabel,
      tags,
      aspect,
      videoWebm,
      videoMp4,
      poster,
      client,
      description,
      duration,
      sourceUrl,
      specs,
      sortOrder,
      isActive,
    } = body;

    if (!title || !videoMp4) {
      return NextResponse.json(
        { success: false, error: 'Title and Video URL are required' },
        { status: 400 }
      );
    }

    const newProject = await createProject({
      id: '',
      title,
      category: category || '',
      categoryLabel: categoryLabel || '',
      tags: Array.isArray(tags) ? tags : [],
      aspect: aspect || 'vertical',
      videoWebm: videoWebm || videoMp4,
      videoMp4,
      poster: poster || '/assets/burger-promo-poster.webp',
      client: client ? String(client).trim() : '',
      description: description || '',
      duration: duration || '0:15',
      sourceUrl: sourceUrl || 'https://instagram.com/zylitch',
      specs: specs || {
        fps: '',
        colorGrade: '',
        sound: '',
      },
      sortOrder: Number(sortOrder || 0),
      isActive: isActive !== false,
    });

    // Notify search engines immediately via IndexNow
    notifyIndexNow([`${SITE_URL}/work/${newProject.id}`, `${SITE_URL}/work`]).catch(() => {});

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    console.error('Admin create project failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
