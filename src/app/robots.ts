import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'Bytespider',
          'CCBot',
          'Diffbot',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Video',
          'Bingbot',
          'YandexBot',
          'Baiduspider',
          'Yeti',
          'Daumoa',
          'Pinterestbot',
          'Applebot',
          'DuckDuckBot',
        ],
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/video-sitemap.xml`,
    ],
    host: SITE_URL,
  };
}
