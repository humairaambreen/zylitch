import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZYLITCH | Commercial Video Editor & Motion Design',
    short_name: 'ZYLITCH',
    description: 'High-impact commercial video editing, brand launch reels, and cinematic color grading.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07080a',
    theme_color: '#07080a',
    orientation: 'portrait-primary',
    categories: ['entertainment', 'multimedia', 'portfolio', 'design'],
    lang: 'en',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
