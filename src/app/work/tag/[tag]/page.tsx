import { Metadata } from 'next';
import { headers } from 'next/headers';
import WorkPageClient from '@/components/WorkPageClient';
import { getAllProjects } from '@/lib/db';
import { extractHashtags } from '@/lib/defaultPins';
import { SITE_URL, SupportedLocale, generateHreflangLinks, generateTagJsonLd } from '@/lib/seo';
import { getLocalizedTag } from '@/lib/postTranslations';
import { translateProject } from '@/lib/translateService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const cleanTag = decodeURIComponent(tag).toLowerCase().replace(/^#/, '');
  const headersList = await headers();
  const locale = (headersList.get('x-zylitch-locale') as SupportedLocale) || 'en';
  const localizedTag = getLocalizedTag(cleanTag, locale);
  const tagUrl = `${SITE_URL}/work/tag/${cleanTag}`;
  const ogImg = `${SITE_URL}/work/tag/${cleanTag}/opengraph-image`;

  return {
    title: `#${localizedTag.toUpperCase()} Commercial Video Editing & Reels | ZYLITCH`,
    description: `Explore commercial video edits, high-retention social reels, and cinematic storytelling tagged #${localizedTag} by Zylitch.`,
    keywords: [
      localizedTag,
      cleanTag,
      `${localizedTag} video editing`,
      `${cleanTag} commercial`,
      `${cleanTag} reels`,
      'Commercial Video Editor',
      'Zylitch Portfolio',
    ],
    alternates: {
      canonical: tagUrl,
      languages: generateHreflangLinks(`/work/tag/${cleanTag}`),
    },
    openGraph: {
      type: 'website',
      url: tagUrl,
      title: `#${localizedTag.toUpperCase()} Commercial Video Portfolio | ZYLITCH`,
      description: `Curated #${localizedTag} video edits, brand promos, and high-retention campaigns by Zylitch.`,
      siteName: 'ZYLITCH',
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: `#${cleanTag} Video Editing Portfolio`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `#${cleanTag.toUpperCase()} Video Editing Portfolio | ZYLITCH`,
      description: `Curated #${cleanTag} commercial video edits and high-retention campaigns by Zylitch.`,
      images: [ogImg],
      creator: '@zylitch',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const cleanTag = decodeURIComponent(tag).toLowerCase().replace(/^#/, '');

  const headersList = await headers();
  const locale = (headersList.get('x-zylitch-locale') as SupportedLocale) || 'en';
  const localizedTag = getLocalizedTag(cleanTag, locale);

  const allProjects = await getAllProjects(false);
  const matchingProjects = allProjects.filter((p) => {
    const tags = p.tags && p.tags.length > 0 ? p.tags : extractHashtags(p.description || '');
    return tags.some((t) => t.toLowerCase() === cleanTag) || p.description?.toLowerCase().includes(`#${cleanTag}`);
  });

  const localizedProjects = await Promise.all(
    matchingProjects.map((p) => translateProject(p, locale))
  );

  const jsonLd = generateTagJsonLd(cleanTag, localizedProjects.length, localizedProjects);

  return (
    <>
      {/* Strict Google CollectionPage Schema.org @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Raw SSR Semantic Fallback for Non-JS Crawlers (PerplexityBot, GPTBot, ClaudeBot) */}
      <noscript>
        <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h1>#{localizedTag.toUpperCase()} Commercial Video Editing Portfolio — ZYLITCH</h1>
          <p>
            {localizedProjects.length} commercial video projects, social reels, and campaigns tagged #{localizedTag} edited by Zylitch.
          </p>
          <ul>
            {localizedProjects.map((p) => (
              <li key={p.id}>
                <a href={`/work/${p.id}`}>
                  <strong>{p.title}</strong>
                </a>{' '}
                — Runtime: {p.duration} | Format: {p.aspect}
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </noscript>

      {/* Interactive Client Component with Pre-selected Tag */}
      <WorkPageClient initialTag={cleanTag} initialPins={localizedProjects} />
    </>
  );
}
