import type { Metadata, Viewport } from 'next';
import PageTransition from '@/components/PageTransition';
import { LocaleProvider } from '@/components/LocaleContext';
import { SITE_URL, generateHreflangLinks, generateRootJsonLd } from '@/lib/seo';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#07080a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ZYLITCH — Commercial Video Editor & Visual Storyteller',
    template: '%s | ZYLITCH',
  },
  description:
    'High-impact commercial video editing, brand launch reels, food sizzle reels, and cinematic color grading by Zylitch. Delivering scroll-stopping visual impact.',
  keywords: [
    'Zylitch',
    '질리치',
    'ジリッチ',
    'Video Editor',
    'Commercial Video Editing',
    'Food Sizzle Reels',
    'Brand Promos',
    'Social Media Campaigns',
    'Color Grading',
    'DaVinci Resolve',
    'Reels Editor',
    'Kinetic Typography',
    'Creative Direction',
  ],
  authors: [{ name: 'Zylitch', url: SITE_URL }],
  creator: 'Zylitch',
  publisher: 'Zylitch',
  alternates: {
    canonical: SITE_URL,
    languages: generateHreflangLinks('/'),
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'google-site-verification-zylitch-2026',
    yandex: process.env.YANDEX_VERIFICATION || 'yandex-verification-zylitch',
    yahoo: process.env.MSVALIDATE_01 || 'msvalidate-01-zylitch',
    other: {
      'baidu-site-verification': process.env.BAIDU_UNION_VERIFY || 'baidu-union-verify-zylitch',
      'naver-site-verification': process.env.NAVER_SITE_VERIFICATION || 'naver-site-verification-zylitch',
      'p:domain_verify': process.env.PINTEREST_DOMAIN_VERIFY || 'pinterest-domain-verify-zylitch',
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR', 'ja_JP', 'es_ES', 'fr_FR', 'de_DE', 'ru_RU'],
    url: SITE_URL,
    siteName: 'ZYLITCH',
    title: 'ZYLITCH — Commercial Video Editor & Visual Storyteller',
    description:
      'High-impact commercial video editing, brand launch reels, food sizzle reels, and cinematic color grading by Zylitch.',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'ZYLITCH — Commercial Video Editor & Visual Storyteller',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZYLITCH — Commercial Video Editor & Visual Storyteller',
    description:
      'High-impact commercial video editing, brand launch reels, and cinematic color grading.',
    images: [`${SITE_URL}/opengraph-image`],
    creator: '@zylitch',
    site: '@zylitch',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootJsonLd = generateRootJsonLd();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="alternate" type="application/rss+xml" title="ZYLITCH MRSS Feed" href={`${SITE_URL}/feed.xml`} />
        
        {/* W3C Speculation Rules API for instant pre-rendering */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  source: 'list',
                  urls: ['/work'],
                  eagerness: 'moderate',
                },
              ],
              prefetch: [
                {
                  source: 'list',
                  urls: ['/api/geo'],
                  eagerness: 'conservative',
                },
              ],
            }),
          }}
        />

        {/* Global Root Schema.org Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rootJsonLd),
          }}
        />
      </head>
      <body>
        {/* Hidden SVG sprite for cursor paws */}
        <svg id="svg-sprite" xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
          <symbol id="paw" viewBox="0 0 249 209.32">
            <ellipse cx="27.917" cy="106.333" strokeWidth="0" rx="27.917" ry="35.833" />
            <ellipse cx="84.75" cy="47.749" strokeWidth="0" rx="34.75" ry="47.751" />
            <ellipse cx="162" cy="47.749" strokeWidth="0" rx="34.75" ry="47.751" />
            <ellipse cx="221.083" cy="106.333" strokeWidth="0" rx="27.917" ry="35.833" />
            <path
              strokeWidth="0"
              d="M43.98 165.39s9.76-63.072 76.838-64.574c0 0 71.082-6.758 83.096 70.33 0 0 2.586 19.855-12.54 31.855 0 0-15.75 17.75-43.75-6.25 0 0-7.124-8.374-24.624-7.874 0 0-12.75-.125-21.5 6.625 0 0-16.375 18.376-37.75 12.75 0 0-28.29-7.72-19.77-42.86z"
            />
          </symbol>
        </svg>

        <LocaleProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </LocaleProvider>
      </body>
    </html>
  );
}
