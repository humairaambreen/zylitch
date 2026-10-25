export interface PortfolioItem {
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
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
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
