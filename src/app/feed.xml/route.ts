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
    console.error('Error querying projects for MRSS feed:', err);
  }

  const toAbsoluteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const itemsXml = projects
    .map((p) => {
      const pageUrl = `${SITE_URL}/work/${p.id}`;
      const videoRaw = p.videoMp4 || p.videoWebm || '';
      const videoSrc = toAbsoluteUrl(videoRaw);
      const thumbSrc = toAbsoluteUrl(p.poster || `${SITE_URL}/work/${p.id}/opengraph-image`);
      const pubDate = new Date(p.createdAt || Date.now()).toUTCString();
      const durationSec = parseDurationSeconds(p.duration);

      return `    <item>
      <title>${escapeXml(p.title || 'Video Reel | ZYLITCH')}</title>
      <link>${escapeXml(pageUrl)}</link>
      <guid isPermaLink="true">${escapeXml(pageUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.description || `${p.title} - High-impact video edit by Zylitch.`)}</description>
      ${videoSrc ? `<media:content url="${escapeXml(videoSrc)}" medium="video" duration="${durationSec}" type="video/mp4" />` : ''}
      <media:thumbnail url="${escapeXml(thumbSrc)}" />
      <media:title>${escapeXml(p.title)}</media:title>
      <media:description>${escapeXml(p.description || '')}</media:description>
      <media:credit role="editor">Zylitch</media:credit>
      ${p.category ? `<media:category>${escapeXml(p.categoryLabel || p.category)}</media:category>` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ZYLITCH Commercial Video Archive</title>
    <link>${SITE_URL}</link>
    <description>Dynamic commercial video editing, brand reels, food sizzle showcases, and color grading portfolio.</description>
    <language>en-US</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
