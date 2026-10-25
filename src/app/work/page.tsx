import { Metadata } from 'next';
import { headers } from 'next/headers';
import WorkPageClient from '@/components/WorkPageClient';
import { getAllProjects } from '@/lib/db';
import { SITE_URL, SupportedLocale, generateHreflangLinks, generateWorkArchiveJsonLd } from '@/lib/seo';
import { translateProject } from '@/lib/translateService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/work`;
  const ogImg = `${SITE_URL}/work/opengraph-image`;

  return {
    title: 'Commercial Video Editing & Brand Reel Archive | ZYLITCH',
    description:
      'Curated portfolio of commercial video edits, high-energy social campaigns, tabletop food sizzle reels, and color graded films by Zylitch.',
    keywords: [
      'Commercial Video Editor',
      'Video Editing Portfolio',
      'Food Commercials',
      'Reels Editor',
      'Color Grading',
      'Zylitch Work',
      'Brand Promos',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: generateHreflangLinks('/work'),
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: 'Commercial Video Editing & Brand Reel Archive | ZYLITCH',
      description:
        'Curated portfolio of high-impact commercial video edits, social campaigns, food sizzle reels, and cinematic storytelling.',
      siteName: 'ZYLITCH',
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: 'ZYLITCH Commercial Video Editing Portfolio',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Commercial Video Editing & Brand Reel Archive | ZYLITCH',
      description:
        'Curated portfolio of commercial video edits, social campaigns, and cinematic films by Zylitch.',
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

export default async function WorkPage() {
  const headersList = await headers();
  const locale = (headersList.get('x-zylitch-locale') as SupportedLocale) || 'en';
  const rawProjects = await getAllProjects(false);
  const projects =
    locale !== 'en'
      ? await Promise.all(rawProjects.map((p) => translateProject(p, locale)))
      : rawProjects;
  const jsonLd = generateWorkArchiveJsonLd(projects);

  return (
    <>
      {/* Strict Schema.org @graph for Google & AI Answer Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Raw SSR Semantic Fallback for Non-JS Crawlers (PerplexityBot, GPTBot, ClaudeBot) */}
      <noscript>
        <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h1>Commercial Video Editing & Brand Reel Archive — ZYLITCH</h1>
          <p>
            Curated portfolio of high-impact commercial video edits, social campaigns, food sizzle reels, and cinematic storytelling edited by Zylitch.
          </p>
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                <a href={`/work/${p.id}`}>
                  <strong>{p.title}</strong>
                </a>{' '}
                — {p.client ? `Client: ${p.client} | ` : ''}Runtime: {p.duration}
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </noscript>

      {/* Interactive Client Component */}
      <WorkPageClient initialTag="all" initialPins={projects} />
    </>
  );
}
