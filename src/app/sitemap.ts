import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/db';
import { SITE_URL, generateHreflangLinks } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];

  try {
    projects = await getAllProjects();
  } catch (err) {
    console.error('Error loading projects for sitemap:', err);
  }

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: generateHreflangLinks('/'),
      },
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: generateHreflangLinks('/work'),
      },
    },
  ];

  // Individual post URLs (/work/[id])
  for (const project of projects) {
    const postPath = `/work/${project.id}`;
    const lastModified = project.updatedAt ? new Date(project.updatedAt) : now;

    entries.push({
      url: `${SITE_URL}${postPath}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: generateHreflangLinks(postPath),
      },
    });
  }

  // Tag URLs (/work/tag/[tag])
  const tagSet = new Set<string>();
  for (const project of projects) {
    if (Array.isArray(project.tags)) {
      for (const t of project.tags) {
        const clean = t.replace(/^#/, '').trim().toLowerCase();
        if (clean) tagSet.add(clean);
      }
    }
  }

  for (const tag of Array.from(tagSet)) {
    const tagPath = `/work/tag/${encodeURIComponent(tag)}`;
    entries.push({
      url: `${SITE_URL}${tagPath}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: generateHreflangLinks(tagPath),
      },
    });
  }

  return entries;
}
