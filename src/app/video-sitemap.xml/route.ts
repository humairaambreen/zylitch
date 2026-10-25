import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/db';
import { SITE_URL, parseDurationSeconds } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
  try {
    projects = await getAllProjects();
  } catch (err) {
    console.error('Error querying projects for video sitemap:', err);
  }

  const toAbsoluteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const itemsXml = projects
    .filter((p) => p.videoMp4 || p.videoWebm || p.poster)
    .map((p) => {
      const pageUrl = `${SITE_URL}/work/${p.id}`;
      const videoRaw = p.videoMp4 || p.videoWebm || '';
      const videoSrc = toAbsoluteUrl(videoRaw);
      const thumbSrc = toAbsoluteUrl(p.poster || `${SITE_URL}/work/${p.id}/opengraph-image`);
      const pubDate = new Date(p.createdAt || Date.now()).toISOString();
      const durationSec = parseDurationSeconds(p.duration);
      const tags = (p.tags || []).slice(0, 32);

      const tagsXml = tags
        .map((t) => `<video:tag>${escapeXml(t.replace(/^#/, ''))}</video:tag>`)
        .join('\n        ');

      return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumbSrc)}</video:thumbnail_loc>
      <video:title>${escapeXml(p.title || 'Commercial Video Reel | ZYLITCH')}</video:title>
      <video:description>${escapeXml(p.description || `${p.title} - Commercial video production, high-impact motion editing, and color grading by Zylitch.`)}</video:description>
      ${videoSrc ? `<video:content_loc>${escapeXml(videoSrc)}</video:content_loc>` : ''}
      <video:player_loc allow_embed="yes" autoplay="ap=1">${escapeXml(pageUrl)}</video:player_loc>
      <video:duration>${durationSec}</video:duration>
      <video:publication_date>${pubDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:uploader info="${SITE_URL}">Zylitch</video:uploader>
      ${p.category ? `<video:category>${escapeXml(p.categoryLabel || p.category)}</video:category>` : ''}
      ${tagsXml}
    </video:video>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${itemsXml}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
