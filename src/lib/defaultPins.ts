export interface WorkPin {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  aspect: 'vertical' | 'square' | 'wide';
  videoWebm: string;
  videoMp4: string;
  poster: string;
  client?: string;
  description: string;
  duration: string;
  sourceUrl?: string;
  specs?: {
    fps?: string;
    colorGrade?: string;
    sound?: string;
  };
}

/**
 * Extracts hashtags from description text (e.g. "#food #cinematic" -> ["food", "cinematic"])
 */
export function extractHashtags(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/#[a-zA-Z0-9_\u0080-\uFFFF]+/g);
  if (!matches) return [];
  const set = new Set<string>();
  for (const m of matches) {
    const clean = m.slice(1).toLowerCase().trim();
    if (clean) set.add(clean);
  }
  return Array.from(set);
}

const RAW_DEFAULT_PINS: Array<Omit<WorkPin, 'tags'>> = [
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
    specs: {
      fps: '120fps High-Speed Macro',
      colorGrade: 'Warm Saturated 35mm Emulation',
    },
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
    specs: {
      fps: '60fps Kinetic Pacing',
      colorGrade: 'San Marzano Kodachrome Grade',
    },
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
    specs: {
      fps: '24fps Cinematic DCI-4K',
      colorGrade: 'Golden Hour 35mm Film Print',
    },
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
    client: 'Artisan Crust Lab',
    description: 'Hypnotic fermentation blister and 900-degree woodfired leopard crust reveal with kinetic cut tempo. #food #pizza #craft #reels',
    duration: '0:22',
    sourceUrl: 'https://instagram.com/zylitch',
    specs: {
      fps: '120fps Macro Flame Blister',
      colorGrade: '900° Woodfired Leopard Contrast',
    },
  },
  {
    id: 'pin-5',
    title: 'Elra Paris — Summer Creator Glow',
    category: 'lifestyle',
    categoryLabel: 'Lifestyle',
    aspect: 'vertical',
    videoWebm: '/assets/influencer-campaign.webm',
    videoMp4: '/assets/influencer-campaign.mp4',
    poster: '/assets/influencer-campaign-poster.webp',
    client: 'Elra Paris',
    description: 'High-energy lifestyle influencer campaign structured for viral retention, hook pacing, and color vibrancy. #lifestyle #campaign #reels #creator',
    duration: '0:20',
    sourceUrl: 'https://instagram.com/zylitch',
    specs: {
      fps: '60fps High-Retention Pacing',
      colorGrade: 'Pastel Glow Editorial Film Look',
    },
  },
  {
    id: 'pin-6',
    title: 'Smash Patty Sensory Cut (120fps)',
    category: 'commercial',
    categoryLabel: 'Commercial',
    aspect: 'square',
    videoWebm: '/assets/burger-promo.webm',
    videoMp4: '/assets/burger-promo.mp4',
    poster: '/assets/burger-promo-poster.webp',
    client: 'Yard Burger Co.',
    description: 'Tactile burger smash commercial with crisp acoustic audio synchronization and hyper-saturated culinary color grade. #food #commercial #burger',
    duration: '0:14',
    sourceUrl: 'https://instagram.com/zylitch',
    specs: {
      fps: '120fps High-Speed Tabletop',
    },
  },
  {
    id: 'pin-7',
    title: 'Quick Chef Symphony — Pomodoro Twist',
    category: 'reels',
    categoryLabel: 'Reels',
    aspect: 'vertical',
    videoWebm: '/assets/pasta-pomodoro.webm',
    videoMp4: '/assets/pasta-pomodoro.mp4',
    poster: '/assets/pasta-pomodoro-poster.webp',
    client: 'Chef Marco Studio',
    description: 'Rapid-fire kitchen sequence engineered for Instagram Reels and TikTok discovery algorithms. #reels #fastcut #kitchen #food',
    duration: '0:15',
    sourceUrl: 'https://instagram.com/zylitch',
    specs: {
      fps: '60fps Algorithm Rhythm',
    },
  },
  {
    id: 'pin-8',
    title: 'Sunset Lake Palace — Royal Rituals',
    category: 'wedding',
    categoryLabel: 'Wedding',
    aspect: 'wide',
    videoWebm: '/assets/indian-wedding.webm',
    videoMp4: '/assets/indian-wedding.mp4',
    poster: '/assets/indian-wedding-poster.webp',
    client: 'Heritage Cinema',
    description: 'Warm 35mm film emulation grading paired with traditional sitar harmonies during the golden hour garland exchange. #wedding #tradition #goldenhour',
    duration: '0:40',
    sourceUrl: 'https://instagram.com/zylitch',
    specs: {
      fps: '24fps Anamorphic 35mm',
      colorGrade: 'Warm Sunset Amber Film Grade',
    },
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
    specs: {
      fps: '60fps 4K Macro Close-Up',
      colorGrade: 'Smoky Hearth Contrast Cinema',
    },
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
    specs: {
      fps: '60fps Split Pacing Sync',
      colorGrade: 'Vibrant Paris Lifestyle Grade',
    },
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
    specs: {
      fps: '120fps Macro Tabletop',
    },
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
    specs: {
      fps: '24fps HDR Cinema',
      colorGrade: 'Twilight Sparkler Warmth Grade',
    },
  },
];

export const DEFAULT_SEEDED_PINS: WorkPin[] = RAW_DEFAULT_PINS.map((pin) => ({
  ...pin,
  tags: extractHashtags(pin.description),
}));
