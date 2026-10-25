import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx > -1) {
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    env[k] = v;
  }
}

const client = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

async function seed() {
  console.log('Connecting to Turso DB:', env.TURSO_DATABASE_URL);

  // 1. Ensure tables exist
  await client.execute(`
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

  await client.execute(`
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

  const now = Date.now();

  // 2. Showcase Items
  const showcaseItems = [
    {
      id: 0,
      titleTop: "BRAND",
      titleBottom: "PROMOS",
      leftTitle: "CRAVE",
      leftText: "Sizzling close-ups, warm tones, a mouthwatering edit. The burger promo turns product into pure appetite, cut for scroll-stopping impact.",
      rightTitle: "Appetite",
      rightText: "Graded color, tight pacing, and craving in every frame. A punchy blend of product shots and rhythm, built to convert.",
      videoWebm: "/assets/burger-promo.webm",
      videoMp4: "/assets/burger-promo.mp4",
      posterSrc: "/assets/burger-promo-poster.webp",
      videoSrc: "/assets/burger-promo.mp4",
      width: 1080,
      height: 1080,
    },
    {
      id: 1,
      titleTop: "TASTE",
      titleBottom: "STORIES",
      leftTitle: "SAVOR",
      leftText: "Steam rising, sauce swirling, a reel built to taste. This pasta pomodoro edit turns a simple plate into a craving.",
      rightTitle: "Aroma",
      rightText: "Rich texture, warm color, and rhythm in every cut. A foodie-first edit designed to travel, share, and satisfy.",
      videoWebm: "/assets/pasta-pomodoro.webm",
      videoMp4: "/assets/pasta-pomodoro.mp4",
      posterSrc: "/assets/pasta-pomodoro-poster.webp",
      videoSrc: "/assets/pasta-pomodoro.mp4",
      width: 720,
      height: 1280,
    },
    {
      id: 2,
      titleTop: "LOVE",
      titleBottom: "FILMS",
      leftTitle: "Ritual",
      leftText: "Golden light, tender moments, a cinematic memory. This Indian wedding film captures the color and ceremony of the day.",
      rightTitle: "Emotion",
      rightText: "Warm grading, gentle pacing, and feeling in every frame. A heartfelt blend of tradition and story, naturally moving.",
      videoWebm: "/assets/indian-wedding.webm",
      videoMp4: "/assets/indian-wedding.mp4",
      posterSrc: "/assets/indian-wedding-poster.webp",
      videoSrc: "/assets/indian-wedding.mp4",
      width: 1280,
      height: 720,
    },
    {
      id: 3,
      titleTop: "CRAFT",
      titleBottom: "KITCHEN",
      leftTitle: "Dough",
      leftText: "Flour in the air, hands at work, a process worth watching. The pizza-making edit turns technique into satisfying visual rhythm.",
      rightTitle: "Fire",
      rightText: "Close texture, steady pacing, and craft in every step. A satisfying blend of process and product, naturally engaging.",
      videoWebm: "/assets/pizza-making.webm",
      videoMp4: "/assets/pizza-making.mp4",
      posterSrc: "/assets/pizza-making-poster.webp",
      videoSrc: "/assets/pizza-making.mp4",
      width: 720,
      height: 1280,
    },
    {
      id: 4,
      titleTop: "SOCIAL",
      titleBottom: "CAMPAIGNS",
      leftTitle: "Reach",
      leftText: "Bold captions, fast cuts, a scroll-ready ad. This influencer campaign edit blends personality with product for maximum reach.",
      rightTitle: "Engage",
      rightText: "Punchy text, confident pacing, and polish in every frame. A modern blend of personality and promotion, naturally shareable.",
      videoWebm: "/assets/influencer-campaign.webm",
      videoMp4: "/assets/influencer-campaign.mp4",
      posterSrc: "/assets/influencer-campaign-poster.webp",
      videoSrc: "/assets/influencer-campaign.mp4",
      width: 720,
      height: 1280,
    },
  ];

  console.log('Seeding showcase items...');
  for (const item of showcaseItems) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO showcase_items (
        id, title_top, title_bottom, left_title, left_text,
        right_title, right_text, video_webm, video_mp4,
        poster_src, video_src, width, height, sort_order,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        item.id,
        item.titleTop,
        item.titleBottom,
        item.leftTitle,
        item.leftText,
        item.rightTitle,
        item.rightText,
        item.videoWebm,
        item.videoMp4,
        item.posterSrc,
        item.videoSrc,
        item.width,
        item.height,
        item.id,
        1,
        now,
        now,
      ],
    });
  }

  // 3. Projects
  const projects = [
    {
      id: 'pin-1',
      title: 'Burger Crave — Sizzle & Tabletop Melt',
      category: 'food',
      categoryLabel: 'Food',
      aspect: 'square',
      videoWebm: '/assets/burger-promo.webm',
      videoMp4: '/assets/burger-promo.mp4',
      poster: '/assets/burger-promo-poster.webp',
      client: 'Gourmet Tabletop Co.',
      description: 'High-speed 120fps macro tabletop capture of flame-seared burgers, melting aged cheddar, and sensory sound design. #food #commercial #sizzle #tabletop',
      duration: '0:15',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '120fps High-Speed Macro', colorGrade: 'Warm Saturated 35mm Emulation' },
    },
    {
      id: 'pin-2',
      title: 'Artisan Pomodoro — Italian Sizzle Reel',
      category: 'food',
      categoryLabel: 'Food',
      aspect: 'vertical',
      videoWebm: '/assets/pasta-pomodoro.webm',
      videoMp4: '/assets/pasta-pomodoro.mp4',
      poster: '/assets/pasta-pomodoro-poster.webp',
      client: 'Trattoria Roma',
      description: 'Sensory vertical kitchen cut blending rich San Marzano tomato gloss, olive oil drizzle, and tactile culinary pacing. #food #reels #italian #pasta',
      duration: '0:18',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '60fps Kinetic Pacing', colorGrade: 'San Marzano Kodachrome Grade' },
    },
    {
      id: 'pin-3',
      title: 'Royal Udaipur — Lake Palace Vows',
      category: 'wedding',
      categoryLabel: 'Wedding',
      aspect: 'wide',
      videoWebm: '/assets/indian-wedding.webm',
      videoMp4: '/assets/indian-wedding.mp4',
      poster: '/assets/indian-wedding-poster.webp',
      client: 'Maharani Films',
      description: 'Grand scale cinematic documentary capturing heritage lakeside ceremonies, royal architecture, and heartfelt emotion. #wedding #cinematic #documentary',
      duration: '0:35',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '24fps Cinematic DCI-4K', colorGrade: 'Golden Hour 35mm Film Print' },
    },
    {
      id: 'pin-4',
      title: 'Sourdough Neapolitan — Oven Rise Cut',
      category: 'food',
      categoryLabel: 'Food',
      aspect: 'vertical',
      videoWebm: '/assets/pizza-making.webm',
      videoMp4: '/assets/pizza-making.mp4',
      poster: '/assets/pizza-making-poster.webp',
      client: 'Forno Antico',
      description: 'Blistered crust puff, bubbling San Marzano passata, and molten fior di latte captured in close-up rhythm. #food #pizza #artisan #reels',
      duration: '0:22',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '60fps High Definition Reel', colorGrade: 'Hearthfire Warmth Grade' },
    },
    {
      id: 'pin-5',
      title: 'Pulse Apparel — Kinetic Streetwear Drop',
      category: 'social',
      categoryLabel: 'Social',
      aspect: 'vertical',
      videoWebm: '/assets/influencer-campaign.webm',
      videoMp4: '/assets/influencer-campaign.mp4',
      poster: '/assets/influencer-campaign-poster.webp',
      client: 'Pulse London',
      description: 'High-energy kinetic typography, rhythmic bass-drop transitions, and bold color blocking for TikTok and Instagram Reels. #social #streetwear #fashion #kinetic',
      duration: '0:20',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '60fps Vertical Reel Cut', colorGrade: 'Tokyo Neon High Contrast' },
    },
    {
      id: 'pin-6',
      title: 'Smash Patties & Caramelized Onions',
      category: 'commercial',
      categoryLabel: 'Commercial',
      aspect: 'square',
      videoWebm: '/assets/burger-promo.webm',
      videoMp4: '/assets/burger-promo.mp4',
      poster: '/assets/burger-promo-poster.webp',
      client: 'Walters Burger Bar',
      description: 'Crisp cast iron smash, sizzling edges, and melting double cheddar with ASMR audio design. #commercial #food #smashburger',
      duration: '0:14',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '120fps Macro Tabletop', colorGrade: 'Rich Amber Tone Curve' },
    },
    {
      id: 'pin-7',
      title: 'Handmade Tagliatelle al Tartufo',
      category: 'food',
      categoryLabel: 'Food',
      aspect: 'vertical',
      videoWebm: '/assets/pasta-pomodoro.webm',
      videoMp4: '/assets/pasta-pomodoro.mp4',
      poster: '/assets/pasta-pomodoro-poster.webp',
      client: 'Cucina Nobilis',
      description: 'Golden yolk pasta rolling, delicate truffle shaving, and creamy emulsion tossed over flame. #food #pasta #italian #luxury',
      duration: '0:17',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '60fps Close-Up Macro', colorGrade: 'Tuscan Sun Warm Grade' },
    },
    {
      id: 'pin-8',
      title: 'Jaipur Palace Courtyard Vows',
      category: 'wedding',
      categoryLabel: 'Wedding',
      aspect: 'wide',
      videoWebm: '/assets/indian-wedding.webm',
      videoMp4: '/assets/indian-wedding.mp4',
      poster: '/assets/indian-wedding-poster.webp',
      client: 'Rajputana Heritage Weddings',
      description: 'Intricate bridal mehndi, marigold floral rain, and candlelit courtyard dance sequences. #wedding #tradition #heritage #india',
      duration: '0:40',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '24fps Cinematic DCI-4K', colorGrade: 'Warm Sunset Amber Film Grade' },
    },
    {
      id: 'pin-9',
      title: 'Woodfired Neapolitan Smoke & Crisp',
      category: 'food',
      categoryLabel: 'Food',
      aspect: 'vertical',
      videoWebm: '/assets/pizza-making.webm',
      videoMp4: '/assets/pizza-making.mp4',
      poster: '/assets/pizza-making-poster.webp',
      client: 'Napoli Craft Pizza',
      description: 'Close-up dough stretching, buffalo mozzarella tear, and fresh basil flame blister in 4K 60fps. #food #pizza #artisan',
      duration: '0:19',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '60fps 4K Macro Close-Up', colorGrade: 'Smoky Hearth Contrast Cinema' },
    },
    {
      id: 'pin-10',
      title: 'Influencer Launch — High Retention Reel',
      category: 'lifestyle',
      categoryLabel: 'Lifestyle',
      aspect: 'vertical',
      videoWebm: '/assets/influencer-campaign.webm',
      videoMp4: '/assets/influencer-campaign.mp4',
      poster: '/assets/influencer-campaign-poster.webp',
      client: 'Studio Pulse',
      description: 'Dynamic typography kinetic cuts, beat drops, and split-second scene changes maximizing viewer watch-through rate. #lifestyle #reels #social #pacing',
      duration: '0:24',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '60fps Split Pacing Sync', colorGrade: 'Vibrant Paris Lifestyle Grade' },
    },
    {
      id: 'pin-11',
      title: 'Tabletop Truffle Burger Macro',
      category: 'commercial',
      categoryLabel: 'Commercial',
      aspect: 'square',
      videoWebm: '/assets/burger-promo.webm',
      videoMp4: '/assets/burger-promo.mp4',
      poster: '/assets/burger-promo-poster.webp',
      client: 'Atelier Gastronomique',
      description: 'Luxury restaurant campaign focusing on artisan brioche glaze, black truffle aioli, and cinematic lighting. #commercial #food #luxury',
      duration: '0:16',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '120fps Macro Tabletop' },
    },
    {
      id: 'pin-12',
      title: 'Baraat Rhythm & Twilight Celebrations',
      category: 'wedding',
      categoryLabel: 'Wedding',
      aspect: 'wide',
      videoWebm: '/assets/indian-wedding.webm',
      videoMp4: '/assets/indian-wedding.mp4',
      poster: '/assets/indian-wedding-poster.webp',
      client: 'Evergreen Vows',
      description: 'High dynamic range night grade capturing dhol drum processions, sparklers, and joyful familial intimacy. #wedding #celebration #night',
      duration: '0:32',
      sourceUrl: 'https://instagram.com/zylitch',
      specs: { fps: '24fps HDR Cinema', colorGrade: 'Twilight Sparkler Warmth Grade' },
    },
  ];

  function extractHashtags(text) {
    if (!text) return [];
    const matches = text.match(/#[a-zA-Z0-9_\u0080-\uFFFF]+/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map(m => m.slice(1).toLowerCase().trim())));
  }

  console.log('Seeding projects...');
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const tags = extractHashtags(p.description);
    await client.execute({
      sql: `INSERT OR REPLACE INTO projects (
        id, title, category, category_label, tags, aspect,
        video_webm, video_mp4, poster, client, description,
        duration, source_url, specs, sort_order, is_active,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id,
        p.title,
        p.category,
        p.categoryLabel,
        JSON.stringify(tags),
        p.aspect,
        p.videoWebm,
        p.videoMp4,
        p.poster,
        p.client,
        p.description,
        p.duration,
        p.sourceUrl,
        JSON.stringify(p.specs || {}),
        i,
        1,
        now,
        now,
      ],
    });
  }

  const pCount = await client.execute('SELECT COUNT(*) as count FROM projects');
  const sCount = await client.execute('SELECT COUNT(*) as count FROM showcase_items');
  console.log(`✓ Seed complete! Total projects in Turso: ${pCount.rows[0].count}, Total showcase items: ${sCount.rows[0].count}`);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
