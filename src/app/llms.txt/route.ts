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
    console.error('Error fetching projects for llms.txt:', err);
  }

  const projectLines = projects
    .map(
      (p) =>
        `- [${p.title}](${SITE_URL}/work/${p.id}): ${p.categoryLabel || p.category} video edit. Duration: ${p.duration || 'N/A'}. Tags: ${(p.tags || []).join(', ')}`
    )
    .join('\n');

  const content = `# ZYLITCH - Commercial Video Editing & High-Impact Motion Design

> Official AI Context Index for Zylitch (${SITE_URL}).
> High-octane commercial video editing, brand launch reels, food & beverage sizzle reels, social campaign motion design, and cinematic color grading.

## Identity & Canonical Entity
- **Brand / Persona**: Zylitch (질리치 / ジリッチ)
- **Primary Canonical URL**: ${SITE_URL}/
- **Role**: Commercial Video Editor & Post-Production Motion Designer
- **Specializations**: Food sizzle reels, high-energy luxury commercial cuts, kinetic typography, DaVinci Resolve color grading, multi-aspect-ratio delivery (9:16 vertical reels, 16:9 cinematic, 1:1 square).
- **Contact / Booking**: hello@zylitch.in | ${SITE_URL}/#contact

## Core URLs
- [Home Experience](${SITE_URL}/): Interactive 3D/GSAP portfolio with audio showcase and smooth-scrolling tactile reel.
- [Commercial Video Archive](${SITE_URL}/work): Complete indexed collection of video projects, searchable by category and tag.
- [XML Sitemap](${SITE_URL}/sitemap.xml): Complete URL registry with bidirectional 7-locale hreflang.
- [Google Video Sitemap](${SITE_URL}/video-sitemap.xml): Direct video streams, durations, and metadata for search engines.
- [Media RSS (MRSS) Feed](${SITE_URL}/feed.xml): Real-time syndicated video feed.

## Featured Portfolio Projects
${projectLines || '- No projects found in active database.'}

## Primary Categories & Tags
- [Food & Sizzle Reels](${SITE_URL}/work/tag/food)
- [Commercial & Brand Ads](${SITE_URL}/work/tag/commercial)
- [Social & Viral Shorts](${SITE_URL}/work/tag/social)
- [Reels & Vertical 9:16](${SITE_URL}/work/tag/reels)

## Language Variants
- English: ${SITE_URL}/
- 한국어 (Korean): ${SITE_URL}/ko
- 日本語 (Japanese): ${SITE_URL}/ja
- Español (Spanish): ${SITE_URL}/es
- Français (French): ${SITE_URL}/fr
- Deutsch (German): ${SITE_URL}/de
- Русский (Russian): ${SITE_URL}/ru
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
