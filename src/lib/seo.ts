export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zylitch.in';
export const SITE_NAME = 'ZYLITCH';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-cover.png`;

export const SUPPORTED_LOCALES = ['en', 'ko', 'ja', 'es', 'fr', 'de', 'ru'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const LOCALE_LABELS: Record<SupportedLocale, { name: string; native: string; flag: string }> = {
  en: { name: 'English', native: 'English', flag: '🇺🇸' },
  ko: { name: 'Korean', native: '한국어', flag: '🇰🇷' },
  ja: { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  es: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', native: 'Français', flag: '🇫🇷' },
  de: { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  ru: { name: 'Russian', native: 'Русский', flag: '🇷🇺' },
};

/**
 * Converts mm:ss or ss duration string to strict ISO 8601 duration format (e.g. PT15S, PT1M30S)
 * strictly required by Google Video Search and Schema.org
 */
export function formatIsoDuration(durationStr: string): string {
  if (!durationStr) return 'PT15S';
  const clean = durationStr.trim();

  // If already in ISO 8601 format
  if (clean.startsWith('PT')) return clean;

  // Handle mm:ss format
  if (clean.includes(':')) {
    const parts = clean.split(':').map((p) => parseInt(p, 10) || 0);
    if (parts.length === 2) {
      const [mins, secs] = parts;
      if (mins > 0 && secs > 0) return `PT${mins}M${secs}S`;
      if (mins > 0) return `PT${mins}M`;
      return `PT${secs}S`;
    }
    if (parts.length === 3) {
      const [hours, mins, secs] = parts;
      return `PT${hours}H${mins}M${secs}S`;
    }
  }

  // Handle raw integer seconds
  const secs = parseInt(clean, 10);
  if (!isNaN(secs) && secs > 0) {
    if (secs >= 60) {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return s > 0 ? `PT${m}M${s}S` : `PT${m}M`;
    }
    return `PT${secs}S`;
  }

  return 'PT15S';
}

/**
 * Converts duration string into integer seconds for Google Video Sitemap
 */
export function parseDurationSeconds(durationStr: string): number {
  if (!durationStr) return 15;
  const clean = durationStr.trim();
  if (clean.includes(':')) {
    const parts = clean.split(':').map((p) => parseInt(p, 10) || 0);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const s = parseInt(clean, 10);
  return !isNaN(s) && s > 0 ? s : 15;
}

/**
 * Generates reciprocal bidirectional hreflang links cluster for Next.js metadata
 */
export function generateHreflangLinks(pathname: string): Record<string, string> {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const base = cleanPath === '/' ? '' : cleanPath;

  return {
    'x-default': `${SITE_URL}${cleanPath}`,
    en: `${SITE_URL}${cleanPath}`,
    ko: `${SITE_URL}/ko${base}`,
    ja: `${SITE_URL}/ja${base}`,
    es: `${SITE_URL}/es${base}`,
    fr: `${SITE_URL}/fr${base}`,
    de: `${SITE_URL}/de${base}`,
    ru: `${SITE_URL}/ru${base}`,
  };
}

/**
 * Global Root Linked Data Graph (WebSite, Organization, Person, FAQPage)
 * Triangulated with canonical Wikidata authority entities.
 */
export function generateRootJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description:
          'Commercial video editing, brand promos, high-energy social campaigns, and cinematic films by Zylitch.',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/work?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/images/furry-zylitch-clean.png`,
          contentUrl: `${SITE_URL}/images/furry-zylitch-clean.png`,
          width: 1156,
          height: 289,
          caption: 'ZYLITCH Editorial Wordmark',
        },
        image: `${SITE_URL}/images/furry-zylitch-clean.png`,
        email: 'hello@zylitch.in',
        sameAs: [
          'https://instagram.com/zylitch',
          'https://vimeo.com/zylitch',
          'https://twitter.com/zylitch',
        ],
        founder: {
          '@id': `${SITE_URL}/#person`,
        },
        knowsAbout: [
          {
            '@type': 'Thing',
            name: 'Video Editing',
            sameAs: 'https://www.wikidata.org/wiki/Q211244',
          },
          {
            '@type': 'Thing',
            name: 'Color Grading',
            sameAs: 'https://www.wikidata.org/wiki/Q1110594',
          },
          {
            '@type': 'Thing',
            name: 'DaVinci Resolve',
            sameAs: 'https://www.wikidata.org/wiki/Q5207185',
          },
          {
            '@type': 'Thing',
            name: 'Television Advertisement',
            sameAs: 'https://www.wikidata.org/wiki/Q876937',
          },
          {
            '@type': 'Thing',
            name: 'Short-form Video',
            sameAs: 'https://www.wikidata.org/wiki/Q110680650',
          },
        ],
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Zylitch',
        jobTitle: 'Lead Commercial Video Editor & Visual Storyteller',
        url: SITE_URL,
        email: 'hello@zylitch.in',
        worksFor: {
          '@id': `${SITE_URL}/#organization`,
        },
        sameAs: ['https://instagram.com/zylitch'],
        description:
          '4+ years of obsessive craft in commercial video editing, brand promos, high-energy social campaigns, and stylized food and lifestyle content.',
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Who is the video editor behind Zylitch?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Zylitch is a specialized commercial and social video editor with over 4 years of obsessive craft in dynamic talking heads, stylized food commercials, celebrity features, and cinematic brand reels.',
            },
          },
          {
            '@type': 'Question',
            name: 'What styles of video does Zylitch edit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Zylitch edits commercial brand promos, high-speed 120fps tabletop food sizzle, luxury lifestyle campaigns, narrative documentary shorts, and high-retention vertical reels (9:16) for Instagram and TikTok.',
            },
          },
          {
            '@type': 'Question',
            name: 'What editing software and color grading pipeline does Zylitch use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Zylitch works primarily in DaVinci Resolve Studio and Adobe Premiere Pro, leveraging custom 35mm film emulation LUTs, ACES color managed workflows, sound design, and motion typography.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the turnaround time for a commercial video edit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Turnaround depends on project scope, with rapid 24-48 hour delivery available for social reels and campaign cutdowns, and comprehensive 5-7 day timelines for full commercial spots with sound mixing and color grading.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I hire or brief Zylitch for a video project?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can reach out directly via email at hello@zylitch.in or on Instagram @zylitch. Simply provide a brief, a mood board, or references, and Zylitch will align on creative direction and delivery.',
            },
          },
        ],
      },
    ],
  };
}

/**
 * Generates unified Schema.org graph for an individual video post page (/work/[id])
 */
export function generatePostJsonLd(project: {
  id: string;
  title: string;
  description: string;
  poster: string;
  videoMp4: string;
  duration: string;
  client?: string;
  createdAt?: number;
  aspect: string;
  tags: string[];
}) {
  const postUrl = `${SITE_URL}/work/${project.id}`;
  const ogImg = `${SITE_URL}/work/${project.id}/opengraph-image`;
  const posterUrl = project.poster.startsWith('http') ? project.poster : `${SITE_URL}${project.poster}`;
  const videoUrl = project.videoMp4.startsWith('http') ? project.videoMp4 : `${SITE_URL}${project.videoMp4}`;
  const durationIso = formatIsoDuration(project.duration);
  const durSecs = parseDurationSeconds(project.duration);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${postUrl}#webpage`,
        url: postUrl,
        name: `${project.title} — Commercial Video by ZYLITCH`,
        description: project.description,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${postUrl}#breadcrumb`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: ogImg,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${postUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Work',
            item: `${SITE_URL}/work`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: postUrl,
          },
        ],
      },
      {
        '@type': 'VideoObject',
        '@id': `${postUrl}#video`,
        name: project.title,
        description: project.description,
        thumbnailUrl: [posterUrl, ogImg],
        uploadDate: new Date(project.createdAt || Date.now()).toISOString(),
        duration: durationIso,
        contentUrl: videoUrl,
        embedUrl: postUrl,
        inLanguage: 'en-US',
        isFamilyFriendly: true,
        keywords: project.tags.join(', '),
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        author: {
          '@id': `${SITE_URL}/#person`,
        },
        hasPart: [
          {
            '@type': 'Clip',
            name: 'Opening Hook & Dynamic Cut',
            startOffset: 0,
            endOffset: Math.min(durSecs, 5),
            url: `${postUrl}?t=0`,
          },
          {
            '@type': 'Clip',
            name: 'Pacing & Stylized Color Grade',
            startOffset: Math.min(durSecs, 5),
            endOffset: durSecs,
            url: `${postUrl}?t=5`,
          },
        ],
      },
    ],
  };
}

/**
 * Generates unified Schema.org graph for a tag archive page (/work/tag/[tag])
 */
export function generateTagJsonLd(tag: string, count: number, projects: Array<{ id: string; title: string; description: string; poster: string; videoMp4: string; duration: string }>) {
  const tagUrl = `${SITE_URL}/work/tag/${tag.toLowerCase()}`;
  const ogImg = `${SITE_URL}/work/tag/${encodeURIComponent(tag.toLowerCase())}/opengraph-image`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${tagUrl}#collection`,
        url: tagUrl,
        name: `#${tag.toUpperCase()} Commercial Video Portfolio | ZYLITCH`,
        description: `Explore ${count} commercial video edits, reels, and stylized films tagged #${tag} by Zylitch.`,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${tagUrl}#breadcrumb`,
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: projects.length,
          itemListElement: projects.map((p, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: `${SITE_URL}/work/${p.id}`,
            name: p.title,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${tagUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Work',
            item: `${SITE_URL}/work`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `#${tag}`,
            item: tagUrl,
          },
        ],
      },
    ],
  };
}

/**
 * Generates unified Schema.org graph for the main work archive page (/work)
 */
export function generateWorkArchiveJsonLd(projects: Array<{ id: string; title: string; description: string }>) {
  const workUrl = `${SITE_URL}/work`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${workUrl}#collection`,
        url: workUrl,
        name: 'Commercial Video Editing & Brand Reel Archive | ZYLITCH',
        description: 'Comprehensive portfolio of commercial video edits, social campaigns, food sizzle reels, and color graded films by Zylitch.',
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${workUrl}#breadcrumb`,
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: projects.length,
          itemListElement: projects.map((p, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: `${SITE_URL}/work/${p.id}`,
            name: p.title,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${workUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Work',
            item: workUrl,
          },
        ],
      },
    ],
  };
}

/**
 * Pings IndexNow API to immediately notify Bing, Yandex, and Naver of URL updates
 */
export async function notifyIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY || 'zylitch2026indexnow';
  const host = 'zylitch.in';

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `https://${host}/${key}.txt`,
        urlList: urls,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('IndexNow ping error:', err);
    return false;
  }
}
