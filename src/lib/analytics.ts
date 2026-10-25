import { getDb, ensureInitialized } from './db';

export interface GeoLocation {
  country: string;
  region: string; // State / Province
  city: string;
}

/**
 * Extract GeoIP location from incoming request headers using Vercel GeoIP headers.
 */
export function extractGeoLocation(headers: Headers): GeoLocation {
  const rawCountry = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || '';
  const rawRegion = headers.get('x-vercel-ip-country-region') || '';
  const rawCity = headers.get('x-vercel-ip-city') || '';

  let city = 'Unknown';
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = rawCity;
    }
  }

  const country = rawCountry.trim() || 'Unknown';
  const region = rawRegion.trim() || 'Unknown';

  return {
    country,
    region,
    city,
  };
}

export interface VideoAnalyticsItem {
  projectId: string;
  title: string;
  client: string;
  poster: string;
  opens: number;
  reelClicks: number;
  reelCtr: number;
  avgWatchSeconds: number;
  totalWatchSeconds: number;
}

export interface GeoMetricItem {
  name: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  kpis: {
    totalOpens: number;
    totalReelClicks: number;
    overallReelCtr: number;
    totalWatchSeconds: number;
    averageWatchSeconds: number;
    uniqueSessions: number;
  };
  videos: VideoAnalyticsItem[];
  geo: {
    byCountry: GeoMetricItem[];
    byRegion: GeoMetricItem[]; // State / Province
    byCity: GeoMetricItem[];
  };
  recentEvents: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    eventType: string;
    durationSeconds: number;
    country: string;
    region: string;
    city: string;
    createdAt: number;
  }>;
}

/**
 * Compile aggregated analytics for the admin dashboard
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  await ensureInitialized();
  const db = getDb();

  // 1. Fetch total counts
  const totalOpensRes = await db.execute(`
    SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'video_open';
  `);
  const totalOpens = Number(totalOpensRes.rows[0]?.count || 0);

  const totalReelClicksRes = await db.execute(`
    SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'show_reel_click';
  `);
  const totalReelClicks = Number(totalReelClicksRes.rows[0]?.count || 0);

  const watchTimeRes = await db.execute(`
    SELECT SUM(duration_seconds) as total_sec, AVG(duration_seconds) as avg_sec
    FROM analytics_events
    WHERE event_type = 'video_watch_time' AND duration_seconds > 0;
  `);
  const totalWatchSeconds = Math.round(Number(watchTimeRes.rows[0]?.total_sec || 0));
  const averageWatchSeconds = Math.round(Number(watchTimeRes.rows[0]?.avg_sec || 0) * 10) / 10;

  const sessionsRes = await db.execute(`
    SELECT COUNT(DISTINCT session_id) as count FROM analytics_events WHERE session_id IS NOT NULL;
  `);
  const uniqueSessions = Number(sessionsRes.rows[0]?.count || 0);

  const overallReelCtr = totalOpens > 0 ? Math.round((totalReelClicks / totalOpens) * 1000) / 10 : 0;

  // 2. Fetch projects mapping
  const projectsRes = await db.execute(`
    SELECT id, title, client, poster FROM projects;
  `);
  const projectsMap = new Map<string, { title: string; client: string; poster: string }>();
  for (const row of projectsRes.rows) {
    projectsMap.set(String(row.id), {
      title: String(row.title),
      client: String(row.client),
      poster: String(row.poster),
    });
  }

  // 3. Per-video metrics
  const videoStatsRes = await db.execute(`
    SELECT
      project_id,
      SUM(CASE WHEN event_type = 'video_open' THEN 1 ELSE 0 END) as opens,
      SUM(CASE WHEN event_type = 'show_reel_click' THEN 1 ELSE 0 END) as reel_clicks,
      SUM(CASE WHEN event_type = 'video_watch_time' THEN duration_seconds ELSE 0 END) as total_duration,
      AVG(CASE WHEN event_type = 'video_watch_time' AND duration_seconds > 0 THEN duration_seconds ELSE NULL END) as avg_duration
    FROM analytics_events
    GROUP BY project_id;
  `);

  const videoStatsMap = new Map<string, any>();
  for (const row of videoStatsRes.rows) {
    videoStatsMap.set(String(row.project_id), row);
  }

  const videos: VideoAnalyticsItem[] = [];
  for (const [id, meta] of projectsMap.entries()) {
    const stats = videoStatsMap.get(id);
    const opens = Number(stats?.opens || 0);
    const reelClicks = Number(stats?.reel_clicks || 0);
    const totalDuration = Math.round(Number(stats?.total_duration || 0));
    const avgDuration = Math.round(Number(stats?.avg_duration || 0) * 10) / 10;
    const reelCtr = opens > 0 ? Math.round((reelClicks / opens) * 1000) / 10 : 0;

    videos.push({
      projectId: id,
      title: meta.title,
      client: meta.client,
      poster: meta.poster,
      opens,
      reelClicks,
      reelCtr,
      avgWatchSeconds: avgDuration,
      totalWatchSeconds: totalDuration,
    });
  }

  // Sort videos by opens descending
  videos.sort((a, b) => b.opens - a.opens);

  // 4. Geographic breakdown
  const countryRes = await db.execute(`
    SELECT country as name, COUNT(*) as count
    FROM analytics_events
    WHERE country IS NOT NULL AND country != '' AND country != 'Unknown'
    GROUP BY country
    ORDER BY count DESC
    LIMIT 10;
  `);
  const totalGeoEvents = countryRes.rows.reduce((acc, r) => acc + Number(r.count), 0) || 1;
  const byCountry: GeoMetricItem[] = countryRes.rows.map((r) => ({
    name: String(r.name),
    count: Number(r.count),
    percentage: Math.round((Number(r.count) / totalGeoEvents) * 100),
  }));

  const regionRes = await db.execute(`
    SELECT region as name, country, COUNT(*) as count
    FROM analytics_events
    WHERE region IS NOT NULL AND region != '' AND region != 'Unknown'
    GROUP BY region, country
    ORDER BY count DESC
    LIMIT 10;
  `);
  const byRegion: GeoMetricItem[] = regionRes.rows.map((r) => ({
    name: `${r.name} (${r.country})`,
    count: Number(r.count),
    percentage: Math.round((Number(r.count) / totalGeoEvents) * 100),
  }));

  const cityRes = await db.execute(`
    SELECT city as name, region, country, COUNT(*) as count
    FROM analytics_events
    WHERE city IS NOT NULL AND city != '' AND city != 'Unknown'
    GROUP BY city, region, country
    ORDER BY count DESC
    LIMIT 10;
  `);
  const byCity: GeoMetricItem[] = cityRes.rows.map((r) => ({
    name: `${r.name}, ${r.region}`,
    count: Number(r.count),
    percentage: Math.round((Number(r.count) / totalGeoEvents) * 100),
  }));

  // 5. Recent events feed
  const recentEventsRes = await db.execute(`
    SELECT id, project_id, event_type, duration_seconds, country, region, city, created_at
    FROM analytics_events
    ORDER BY created_at DESC
    LIMIT 20;
  `);

  const recentEvents = recentEventsRes.rows.map((row) => ({
    id: String(row.id),
    projectId: String(row.project_id),
    projectTitle: projectsMap.get(String(row.project_id))?.title || 'Unknown Project',
    eventType: String(row.event_type),
    durationSeconds: Number(row.duration_seconds || 0),
    country: String(row.country || 'Unknown'),
    region: String(row.region || 'Unknown'),
    city: String(row.city || 'Unknown'),
    createdAt: Number(row.created_at),
  }));

  return {
    kpis: {
      totalOpens,
      totalReelClicks,
      overallReelCtr,
      totalWatchSeconds,
      averageWatchSeconds,
      uniqueSessions,
    },
    videos,
    geo: {
      byCountry,
      byRegion,
      byCity,
    },
    recentEvents,
  };
}
