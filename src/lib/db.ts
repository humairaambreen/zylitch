import { createClient, Client } from '@libsql/client';
import { extractHashtags } from './defaultPins';

export interface ShowcaseItemRecord {
  id: number;
  titleTop: string;
  titleBottom: string;
  leftTitle: string;
  leftText: string;
  rightTitle: string;
  rightText: string;
  videoWebm: string;
  videoMp4: string;
  posterSrc: string;
  videoSrc: string;
  width: number;
  height: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectRecord {
  id: string;
  title: string;
  category: 'food' | 'social' | 'commercial' | 'wedding' | 'reels' | string;
  categoryLabel: string;
  tags: string[];
  aspect: 'vertical' | 'square' | 'wide';
  videoWebm: string;
  videoMp4: string;
  poster: string;
  client: string;
  description: string;
  duration: string;
  sourceUrl: string;
  specs: {
    fps: string;
    colorGrade: string;
    sound: string;
  };
  sortOrder: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AnalyticsEventRecord {
  id: string;
  projectId: string;
  eventType: 'video_open' | 'show_reel_click' | 'video_watch_time';
  durationSeconds: number;
  country: string;
  region: string;
  city: string;
  sessionId?: string;
  createdAt: number;
}

let clientInstance: Client | null = null;
let isInitialized = false;

export function getDb(): Client {
  if (!clientInstance) {
    const url = process.env.TURSO_DATABASE_URL || 'file:zylitch.db';
    const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
    clientInstance = createClient({
      url,
      authToken,
    });
  }
  return clientInstance;
}

export async function ensureInitialized(): Promise<void> {
  if (isInitialized) return;
  const db = getDb();

  // Create Projects Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      category_label TEXT NOT NULL,
      tags TEXT NOT NULL,
      aspect TEXT NOT NULL,
      video_webm TEXT NOT NULL,
      video_mp4 TEXT NOT NULL,
      poster TEXT NOT NULL,
      client TEXT NOT NULL,
      description TEXT NOT NULL,
      duration TEXT NOT NULL,
      source_url TEXT NOT NULL,
      specs TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Create Analytics Events Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      duration_seconds REAL DEFAULT 0,
      country TEXT DEFAULT 'Unknown',
      region TEXT DEFAULT 'Unknown',
      city TEXT DEFAULT 'Unknown',
      session_id TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  // Create Showcase Items Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS showcase_items (
      id INTEGER PRIMARY KEY,
      title_top TEXT NOT NULL,
      title_bottom TEXT NOT NULL,
      left_title TEXT NOT NULL,
      left_text TEXT NOT NULL,
      right_title TEXT NOT NULL,
      right_text TEXT NOT NULL,
      video_webm TEXT NOT NULL,
      video_mp4 TEXT NOT NULL,
      poster_src TEXT NOT NULL,
      video_src TEXT NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Tables are created clean without seeding static mock data
  isInitialized = true;
}

// Map raw SQL row to typed ProjectRecord
function mapRowToProject(row: any): ProjectRecord {
  let tags: string[] = [];
  try {
    tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [];
  } catch {
    tags = [];
  }

  // Ensure tags are extracted from description if none stored or empty
  if ((!tags || tags.length === 0) && row.description) {
    tags = extractHashtags(row.description);
  }

  let specs = { fps: '', colorGrade: '', sound: '' };
  try {
    specs = typeof row.specs === 'string' ? JSON.parse(row.specs) : row.specs || specs;
  } catch {
    // fallback
  }

  const primaryTag = tags[0] || 'visual';
  const category = String(row.category || primaryTag);
  const categoryLabel = String(row.category_label || (tags[0] ? `#${tags[0]}` : 'Visual'));

  return {
    id: String(row.id),
    title: String(row.title),
    category,
    categoryLabel,
    tags,
    aspect: row.aspect as any,
    videoWebm: String(row.video_webm),
    videoMp4: String(row.video_mp4),
    poster: String(row.poster),
    client: String(row.client || ''),
    description: String(row.description || ''),
    duration: String(row.duration || '0:15'),
    sourceUrl: String(row.source_url || 'https://instagram.com/zylitch'),
    specs,
    sortOrder: Number(row.sort_order || 0),
    isActive: Boolean(row.is_active),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

export async function getAllProjects(includeInactive = false): Promise<ProjectRecord[]> {
  await ensureInitialized();
  const db = getDb();
  const query = includeInactive
    ? `SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC;`
    : `SELECT * FROM projects WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC;`;

  const res = await db.execute(query);
  return res.rows.map(mapRowToProject);
}

export async function getProjectById(id: string): Promise<ProjectRecord | null> {
  await ensureInitialized();
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT * FROM projects WHERE id = ? LIMIT 1;`,
    args: [id],
  });
  if (res.rows.length === 0) return null;
  return mapRowToProject(res.rows[0]);
}

export async function createProject(data: Omit<ProjectRecord, 'createdAt' | 'updatedAt'>): Promise<ProjectRecord> {
  await ensureInitialized();
  const db = getDb();
  const now = Date.now();
  const id = data.id || `pin-${now}-${Math.random().toString(36).substring(2, 7)}`;

  // Automatically extract tags from description
  const tags = (data.tags && data.tags.length > 0) ? data.tags : extractHashtags(data.description || '');
  const primaryTag = tags[0] || 'visual';
  const category = data.category || primaryTag;
  const categoryLabel = data.categoryLabel || (tags[0] ? `#${tags[0]}` : 'Visual');

  await db.execute({
    sql: `INSERT INTO projects (
      id, title, category, category_label, tags, aspect,
      video_webm, video_mp4, poster, client, description,
      duration, source_url, specs, sort_order, is_active,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.title,
      category,
      categoryLabel,
      JSON.stringify(tags),
      data.aspect || 'vertical',
      data.videoWebm || data.videoMp4,
      data.videoMp4,
      data.poster || '/assets/burger-promo-poster.webp',
      data.client || '',
      data.description || '',
      data.duration || '0:15',
      data.sourceUrl || 'https://instagram.com/zylitch',
      JSON.stringify(data.specs || { fps: '', colorGrade: '', sound: '' }),
      data.sortOrder ?? 0,
      data.isActive ? 1 : 0,
      now,
      now,
    ],
  });

  return (await getProjectById(id))!;
}

export async function updateProject(id: string, updates: Partial<ProjectRecord>): Promise<ProjectRecord | null> {
  await ensureInitialized();
  const db = getDb();
  const existing = await getProjectById(id);
  if (!existing) return null;

  const now = Date.now();
  const newDescription = updates.description !== undefined ? updates.description : existing.description;
  const newTags = updates.tags !== undefined ? updates.tags : extractHashtags(newDescription || '');
  const primaryTag = newTags[0] || existing.category || 'visual';

  const merged: ProjectRecord = {
    ...existing,
    ...updates,
    description: newDescription,
    tags: newTags,
    category: updates.category || primaryTag,
    categoryLabel: updates.categoryLabel || (newTags[0] ? `#${newTags[0]}` : existing.categoryLabel),
    updatedAt: now,
  };

  await db.execute({
    sql: `UPDATE projects SET
      title = ?,
      category = ?,
      category_label = ?,
      tags = ?,
      aspect = ?,
      video_webm = ?,
      video_mp4 = ?,
      poster = ?,
      client = ?,
      description = ?,
      duration = ?,
      source_url = ?,
      specs = ?,
      sort_order = ?,
      is_active = ?,
      updated_at = ?
    WHERE id = ?`,
    args: [
      merged.title,
      merged.category,
      merged.categoryLabel,
      JSON.stringify(merged.tags),
      merged.aspect,
      merged.videoWebm,
      merged.videoMp4,
      merged.poster,
      merged.client,
      merged.description,
      merged.duration,
      merged.sourceUrl,
      JSON.stringify(merged.specs),
      merged.sortOrder,
      merged.isActive ? 1 : 0,
      now,
      id,
    ],
  });

  return getProjectById(id);
}

export async function deleteProject(id: string): Promise<boolean> {
  await ensureInitialized();
  const db = getDb();
  const res = await db.execute({
    sql: `DELETE FROM projects WHERE id = ?;`,
    args: [id],
  });
  return res.rowsAffected > 0;
}

export async function insertAnalyticsEvent(event: Omit<AnalyticsEventRecord, 'id' | 'createdAt'>): Promise<string> {
  await ensureInitialized();
  const db = getDb();
  const id = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const now = Date.now();

  await db.execute({
    sql: `INSERT INTO analytics_events (
      id, project_id, event_type, duration_seconds,
      country, region, city, session_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      event.projectId,
      event.eventType,
      event.durationSeconds || 0,
      event.country || 'Unknown',
      event.region || 'Unknown',
      event.city || 'Unknown',
      event.sessionId || null,
      now,
    ],
  });

  return id;
}

// Map raw SQL row to typed ShowcaseItemRecord
function mapRowToShowcaseItem(row: any): ShowcaseItemRecord {
  return {
    id: Number(row.id),
    titleTop: String(row.title_top || ''),
    titleBottom: String(row.title_bottom || ''),
    leftTitle: String(row.left_title || ''),
    leftText: String(row.left_text || ''),
    rightTitle: String(row.right_title || ''),
    rightText: String(row.right_text || ''),
    videoWebm: String(row.video_webm || ''),
    videoMp4: String(row.video_mp4 || ''),
    posterSrc: String(row.poster_src || ''),
    videoSrc: String(row.video_src || row.video_mp4 || ''),
    width: Number(row.width || 720),
    height: Number(row.height || 1280),
    sortOrder: Number(row.sort_order || 0),
    isActive: Boolean(row.is_active),
    createdAt: Number(row.created_at || Date.now()),
    updatedAt: Number(row.updated_at || Date.now()),
  };
}

export async function getAllShowcaseItems(includeInactive = false): Promise<ShowcaseItemRecord[]> {
  await ensureInitialized();
  const db = getDb();
  const query = includeInactive
    ? `SELECT * FROM showcase_items ORDER BY sort_order ASC, id ASC;`
    : `SELECT * FROM showcase_items WHERE is_active = 1 ORDER BY sort_order ASC, id ASC;`;

  const res = await db.execute(query);
  return res.rows.map(mapRowToShowcaseItem);
}

export async function getShowcaseItemById(id: number): Promise<ShowcaseItemRecord | null> {
  await ensureInitialized();
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT * FROM showcase_items WHERE id = ? LIMIT 1;`,
    args: [id],
  });
  if (res.rows.length === 0) return null;
  return mapRowToShowcaseItem(res.rows[0]);
}

export async function updateShowcaseItem(
  id: number,
  updates: Partial<ShowcaseItemRecord>
): Promise<ShowcaseItemRecord | null> {
  await ensureInitialized();
  const db = getDb();
  const existing = await getShowcaseItemById(id);
  if (!existing) return null;

  const now = Date.now();
  const merged: ShowcaseItemRecord = {
    ...existing,
    ...updates,
    updatedAt: now,
  };

  await db.execute({
    sql: `UPDATE showcase_items SET
      title_top = ?,
      title_bottom = ?,
      left_title = ?,
      left_text = ?,
      right_title = ?,
      right_text = ?,
      video_webm = ?,
      video_mp4 = ?,
      poster_src = ?,
      video_src = ?,
      width = ?,
      height = ?,
      sort_order = ?,
      is_active = ?,
      updated_at = ?
    WHERE id = ?`,
    args: [
      merged.titleTop,
      merged.titleBottom,
      merged.leftTitle,
      merged.leftText,
      merged.rightTitle,
      merged.rightText,
      merged.videoWebm,
      merged.videoMp4,
      merged.posterSrc,
      merged.videoSrc || merged.videoMp4,
      merged.width,
      merged.height,
      merged.sortOrder,
      merged.isActive ? 1 : 0,
      now,
      id,
    ],
  });

  return getShowcaseItemById(id);
}

export async function createShowcaseItem(
  data: Omit<ShowcaseItemRecord, 'createdAt' | 'updatedAt'>
): Promise<ShowcaseItemRecord> {
  await ensureInitialized();
  const db = getDb();
  const now = Date.now();

  let targetId = data.id;
  if (targetId === undefined || targetId === null) {
    const maxRes = await db.execute(`SELECT MAX(id) as max_id FROM showcase_items;`);
    const maxId = Number(maxRes.rows[0]?.max_id ?? -1);
    targetId = maxId + 1;
  }

  await db.execute({
    sql: `INSERT INTO showcase_items (
      id, title_top, title_bottom, left_title, left_text,
      right_title, right_text, video_webm, video_mp4,
      poster_src, video_src, width, height, sort_order,
      is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      targetId,
      data.titleTop,
      data.titleBottom,
      data.leftTitle,
      data.leftText,
      data.rightTitle,
      data.rightText,
      data.videoWebm || data.videoMp4,
      data.videoMp4,
      data.posterSrc,
      data.videoSrc || data.videoMp4,
      data.width || 720,
      data.height || 1280,
      data.sortOrder ?? targetId,
      data.isActive !== false ? 1 : 0,
      now,
      now,
    ],
  });

  return (await getShowcaseItemById(targetId))!;
}

export async function deleteShowcaseItem(id: number): Promise<boolean> {
  await ensureInitialized();
  const db = getDb();
  const res = await db.execute({
    sql: `DELETE FROM showcase_items WHERE id = ?;`,
    args: [id],
  });
  return res.rowsAffected > 0;
}


