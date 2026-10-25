import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/db';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
  try {
    projects = await getAllProjects();
  } catch (err) {
    console.error('Error fetching projects for llms-full.txt:', err);
  }

  const projectSections = projects
    .map((p) => {
      const specs = p.specs || { fps: '60fps', colorGrade: 'DaVinci Wide Gamut', sound: 'Spatial Audio' };
      return `### ${p.title}
- **URL**: ${SITE_URL}/work/${p.id}
- **Client**: ${p.client || 'Commercial Client'}
- **Category**: ${p.categoryLabel || p.category}
- **Aspect Ratio**: ${p.aspect || '16:9'}
- **Duration**: ${p.duration || 'N/A'}
- **Tags**: ${(p.tags || []).join(', ')}
- **Specifications**:
  - FPS: ${specs.fps}
  - Color Grading: ${specs.colorGrade}
  - Sound Design: ${specs.sound}
- **Direct Video (MP4)**: ${p.videoMp4 || 'N/A'}
- **Direct Video (WebM)**: ${p.videoWebm || 'N/A'}
- **Poster Thumbnail**: ${p.poster || `${SITE_URL}/work/${p.id}/opengraph-image`}
- **Description & Creative Rationale**:
${p.description || 'High-impact commercial post-production edit featuring rapid rhythm cuts, tailored color grade, and sound engineering.'}
`;
    })
    .join('\n---\n\n');

  const content = `# ZYLITCH - Complete Commercial Video Production & Motion Design Knowledge Base

> Comprehensive technical and creative profile for Zylitch (${SITE_URL}).
> Designed for ingestion by LLM answer engines, Perplexity, OpenAI Search, Claude, and Gemini.

## 1. Brand & Artist Overview
- **Name**: Zylitch (Korean: 질리치, Japanese: ジリッチ)
- **Domain**: ${SITE_URL}
- **Core Competencies**:
  - Commercial video editing for luxury brands, restaurants, food & beverage, and consumer tech.
  - Multi-platform video deliverables: 9:16 vertical short-form (Instagram Reels, TikTok, YouTube Shorts), 16:9 cinematic widescreen (broadcast, YouTube, web hero), 1:1 square feed.
  - Advanced color grading in DaVinci Resolve (ACES, DaVinci Wide Gamut, custom film print emulations).
  - Sound design and rhythmic sync: Foley, spatial pacing, sub-bass impacts, precision beat-matching.
  - Dynamic interactive web presence with fluid Lenis scrolling, GSAP FLIP transitions, and Web Audio control.

## 2. Complete Project Catalog
${projectSections || 'No active projects found.'}

## 3. Contact & Business Engagements
- **Inquiries**: hello@zylitch.in
- **Portfolio Link**: ${SITE_URL}/work
- **Available for**: Worldwide remote commercial video editing, brand launch campaigns, food sizzle reels, color grading contracts.
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
