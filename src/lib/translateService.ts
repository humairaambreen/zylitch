import translate from 'translate';
import { SupportedLocale } from './seo';
import { WorkPin } from './defaultPins';
import { PortfolioItem } from '@/data/portfolio';
import { getDb, ensureInitialized } from './db';

// Configure translate engine
translate.engine = 'google';

// Fast in-memory cache to avoid duplicate calls during a request or warm server state
const memoryCache = new Map<string, string>();

/**
 * Initializes the translations_cache table in the SQLite/Turso database if not present.
 */
async function ensureTranslationTable(): Promise<void> {
  try {
    await ensureInitialized();
    const db = getDb();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS translations_cache (
        cache_key TEXT PRIMARY KEY,
        locale TEXT NOT NULL,
        source_text TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
  } catch (err) {
    // If DB is temporarily locked or offline, memory cache operates independently
    console.warn('[translateService] DB table ensure error:', err);
  }
}

/**
 * Dynamically translates any text into the target locale using the real `translate` library.
 * Results are cached in memory and in SQLite so each string is translated only once.
 */
export async function translateText(text: string, toLocale: SupportedLocale): Promise<string> {
  if (!text || toLocale === 'en' || !toLocale) {
    return text;
  }

  const trimmed = text.trim();
  if (trimmed.length === 0 || /^https?:\/\//i.test(trimmed) || /^\d+$/.test(trimmed)) {
    return text;
  }

  const cacheKey = `${toLocale}:${trimmed}`;

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // 2. Check persistent database cache
  try {
    const db = getDb();
    const row = await db.execute({
      sql: 'SELECT translated_text FROM translations_cache WHERE cache_key = ? LIMIT 1',
      args: [cacheKey],
    });
    if (row.rows.length > 0) {
      const val = row.rows[0].translated_text as string;
      memoryCache.set(cacheKey, val);
      return val;
    }
  } catch {
    // Fallthrough to live translation
  }

  // 3. Call the real translation library
  try {
    const translated = await translate(trimmed, { from: 'en', to: toLocale });
    const result = translated || text;

    memoryCache.set(cacheKey, result);

    // Save to persistent SQLite cache asynchronously
    (async () => {
      try {
        await ensureTranslationTable();
        const db = getDb();
        await db.execute({
          sql: `
            INSERT OR REPLACE INTO translations_cache (cache_key, locale, source_text, translated_text, created_at)
            VALUES (?, ?, ?, ?, ?)
          `,
          args: [cacheKey, toLocale, trimmed, result, Date.now()],
        });
      } catch (err) {
        console.warn('[translateService] Cache save error:', err);
      }
    })();

    return result;
  } catch (err) {
    console.error(`[translateService] Error translating "${trimmed.slice(0, 30)}..." to ${toLocale}:`, err);
    return text;
  }
}

/**
 * Dynamically translates all textual fields of a WorkPin project using the real library.
 */
export async function translateProject(project: WorkPin, toLocale: SupportedLocale): Promise<WorkPin> {
  if (toLocale === 'en' || !toLocale || !project) {
    return project;
  }

  const [translatedTitle, translatedDesc, translatedCategory] = await Promise.all([
    translateText(project.title, toLocale),
    translateText(project.description, toLocale),
    project.categoryLabel ? translateText(project.categoryLabel, toLocale) : Promise.resolve(project.categoryLabel),
  ]);

  let translatedFps = project.specs?.fps;
  let translatedGrade = project.specs?.colorGrade;

  if (project.specs?.fps) {
    translatedFps = await translateText(project.specs.fps, toLocale);
  }
  if (project.specs?.colorGrade) {
    translatedGrade = await translateText(project.specs.colorGrade, toLocale);
  }

  return {
    ...project,
    title: translatedTitle,
    description: translatedDesc,
    categoryLabel: translatedCategory,
    specs: {
      ...project.specs,
      fps: translatedFps,
      colorGrade: translatedGrade,
    },
  };
}

/**
 * Dynamically translates a ShowcaseItem using the real library.
 */
export async function translateShowcaseItem(item: PortfolioItem, toLocale: SupportedLocale): Promise<PortfolioItem> {
  if (toLocale === 'en' || !toLocale || !item) {
    return item;
  }

  const [tTop, tBottom, lTitle, lText, rTitle, rText] = await Promise.all([
    translateText(item.titleTop, toLocale),
    translateText(item.titleBottom, toLocale),
    translateText(item.leftTitle, toLocale),
    translateText(item.leftText, toLocale),
    translateText(item.rightTitle, toLocale),
    translateText(item.rightText, toLocale),
  ]);

  return {
    ...item,
    titleTop: tTop,
    titleBottom: tBottom,
    leftTitle: lTitle,
    leftText: lText,
    rightTitle: rTitle,
    rightText: rText,
  };
}
