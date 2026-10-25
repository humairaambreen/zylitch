import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import WorkPageClient from '@/components/WorkPageClient';
import { getProjectById } from '@/lib/db';
import { SITE_URL, SupportedLocale, generateHreflangLinks, generatePostJsonLd, formatIsoDuration } from '@/lib/seo';
import { translateProject } from '@/lib/translateService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return {};

  const headersList = await headers();
  const locale = (headersList.get('x-zylitch-locale') as SupportedLocale) || 'en';
  const loc = await translateProject(project, locale);

  const postUrl = `${SITE_URL}/work/${project.id}`;
  const ogImg = `${SITE_URL}/work/${project.id}/opengraph-image`;
  const isVertical = project.aspect === 'vertical';
  const vidWidth = isVertical ? 1080 : 1920;
  const vidHeight = isVertical ? 1920 : 1080;

  const toAbsoluteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  const absVideoUrl = toAbsoluteUrl(project.videoMp4);

  return {
    title: `${loc.title} — Commercial Video by ZYLITCH`,
    description: `${loc.description} Formatted for ${project.aspect} with high-retention pacing and custom color grading.`,
    keywords: [
      ...project.tags,
      loc.client,
      'Commercial Video Editor',
      'Video Editing Portfolio',
      'Zylitch Video Edit',
      loc.categoryLabel || project.category,
    ].filter(Boolean) as string[],
    alternates: {
      canonical: postUrl,
      languages: generateHreflangLinks(`/work/${project.id}`),
    },
    openGraph: {
      type: 'video.other',
      url: postUrl,
      title: `${loc.title} — Commercial Video by ZYLITCH`,
      description: loc.description,
      siteName: 'ZYLITCH',
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: loc.title,
          type: 'image/png',
        },
      ],
      videos: [
        {
          url: absVideoUrl,
          secureUrl: absVideoUrl,
          type: 'video/mp4',
          width: vidWidth,
          height: vidHeight,
        },
      ],
    },
    twitter: {
      card: 'player',
      title: `${project.title} — Commercial Video by ZYLITCH`,
      description: project.description,
      images: [ogImg],
      players: [
        {
          playerUrl: postUrl,
          streamUrl: absVideoUrl,
          width: vidWidth,
          height: vidHeight,
        },
      ],
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

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const headersList = await headers();
  const locale = (headersList.get('x-zylitch-locale') as SupportedLocale) || 'en';
  const loc = await translateProject(project, locale);

  const jsonLd = generatePostJsonLd(loc);

  return (
    <>
      {/* Strict Google VideoObject Schema.org @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Raw SSR Semantic Fallback for Non-JS Crawlers (PerplexityBot, GPTBot, ClaudeBot) */}
      <noscript>
        <article style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          <header>
            <h1>{loc.title}</h1>
            <p><strong>Client:</strong> {loc.client || 'Zylitch Original Production'}</p>
            <p><strong>Runtime:</strong> {loc.duration} (ISO: {formatIsoDuration(loc.duration)})</p>
            <p><strong>Format:</strong> {loc.aspect}</p>
            {loc.specs?.fps && <p><strong>FPS:</strong> {loc.specs.fps}</p>}
            {loc.specs?.colorGrade && <p><strong>Color Grade:</strong> {loc.specs.colorGrade}</p>}
          </header>
          <section>
            <p>{loc.description}</p>
            <p>
              Direct Video Stream: <a href={loc.videoMp4}>{loc.videoMp4}</a>
            </p>
            <div>
              <strong>Hashtags:</strong>{' '}
              {loc.tags.map((t) => (
                <a key={t} href={`/work/tag/${t}`} style={{ marginRight: '8px' }}>
                  #{t}
                </a>
              ))}
            </div>
          </section>
        </article>
      </noscript>

      {/* Seamless Interactive Client Experience with Modal Pre-Opened */}
      <WorkPageClient initialOpenId={id} />
    </>
  );
}
