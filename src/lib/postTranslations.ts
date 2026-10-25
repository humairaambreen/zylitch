import { SupportedLocale } from './seo';
import { WorkPin } from './defaultPins';

export interface LocalizedPostFields {
  title?: string;
  description?: string;
  categoryLabel?: string;
  client?: string;
  fps?: string;
  colorGrade?: string;
}

/**
 * Returns the project data dynamically without overriding user content
 * with hardcoded static translations. If dynamic per-locale overrides exist
 * on the project (e.g. from the database/CMS), those are respected.
 */
export function getLocalizedPost(pin: WorkPin, locale: SupportedLocale): WorkPin {
  if (!pin || locale === 'en' || !locale) {
    return pin;
  }

  // Check if project has dynamic per-locale translations stored in DB/object
  const dynamicTranslations = (pin as any).translations as Record<string, Partial<WorkPin>> | undefined;
  if (dynamicTranslations && dynamicTranslations[locale]) {
    const loc = dynamicTranslations[locale];
    return {
      ...pin,
      title: loc.title || pin.title,
      description: loc.description || pin.description,
      categoryLabel: loc.categoryLabel || pin.categoryLabel,
      client: loc.client || pin.client,
      specs: {
        ...pin.specs,
        ...loc.specs,
      },
    };
  }

  return pin;
}

export const TAG_TRANSLATIONS: Record<SupportedLocale, Record<string, string>> = {
  en: {},
  ko: {
    food: '푸드',
    reels: '릴스',
    commercial: '상업광고',
    wedding: '웨딩',
    lifestyle: '라이프스타일',
    pizza: '피자',
    artisan: '아티산',
    sizzle: '시즐',
    tabletop: '테이블탑',
    craft: '크래프트',
    campaign: '캠페인',
    cinematic: '시네마틱',
    documentary: '다큐멘터리',
    fastcut: '패스트컷',
    tradition: '전통',
    goldenhour: '골든아워',
    burger: '수제버거',
    pasta: '파스타',
    italian: '이탈리안',
    social: '소셜',
    creator: '크리에이터',
    night: '나이트',
    celebration: '셀레브레이션',
    luxury: '럭셔리',
    kitchen: '키친',
  },
  ja: {
    food: 'フード',
    reels: 'リール',
    commercial: 'コマーシャル',
    wedding: 'ウェディング',
    lifestyle: 'ライフスタイル',
    pizza: 'ピザ',
    artisan: '職人',
    sizzle: 'シズル',
    tabletop: 'テーブルトップ',
    craft: 'クラフト',
    campaign: 'キャンペーン',
    cinematic: 'シネマティック',
    documentary: 'ドキュメンタリー',
    fastcut: 'ファストカット',
    tradition: '伝統',
    goldenhour: 'ゴールデンアワー',
    burger: 'バーガー',
    pasta: 'パスタ',
    italian: 'イタリアン',
    social: 'ソーシャル',
    creator: 'クリエイター',
    night: 'ナイト',
    celebration: '祝祭',
    luxury: 'ラグジュアリー',
    kitchen: 'キッチン',
  },
  es: {
    food: 'Comida',
    reels: 'Reels',
    commercial: 'Comercial',
    wedding: 'Bodas',
    lifestyle: 'Estilo de vida',
    pizza: 'Pizza',
    artisan: 'Artesanal',
    sizzle: 'Sizzle',
    tabletop: 'Tabletop',
    craft: 'Artesanía',
    campaign: 'Campaña',
    cinematic: 'Cinemático',
    documentary: 'Documental',
    fastcut: 'Corte rápido',
    tradition: 'Tradición',
    goldenhour: 'Hora dorada',
    burger: 'Hamburguesa',
    pasta: 'Pasta',
    italian: 'Italiano',
    social: 'Social',
    creator: 'Creador',
    night: 'Noche',
    celebration: 'Celebración',
    luxury: 'Lujo',
    kitchen: 'Cocina',
  },
  fr: {
    food: 'Gastronomie',
    reels: 'Reels',
    commercial: 'Publicité',
    wedding: 'Mariage',
    lifestyle: 'Style de vie',
    pizza: 'Pizza',
    artisan: 'Artisanal',
    sizzle: 'Sizzle',
    tabletop: 'Tabletop',
    craft: 'Artisanat',
    campaign: 'Campagne',
    cinematic: 'Cinématique',
    documentary: 'Documentaire',
    fastcut: 'Rythme rapide',
    tradition: 'Tradition',
    goldenhour: 'Heure dorée',
    burger: 'Burger',
    pasta: 'Pâtes',
    italian: 'Italien',
    social: 'Social',
    creator: 'Créateur',
    night: 'Nuit',
    celebration: 'Célébration',
    luxury: 'Luxe',
    kitchen: 'Cuisine',
  },
  de: {
    food: 'Kulinarik',
    reels: 'Reels',
    commercial: 'Werbung',
    wedding: 'Hochzeit',
    lifestyle: 'Lifestyle',
    pizza: 'Pizza',
    artisan: 'Handwerk',
    sizzle: 'Sizzle',
    tabletop: 'Tabletop',
    craft: 'Handwerk',
    campaign: 'Kampagne',
    cinematic: 'Kinematografisch',
    documentary: 'Dokumentarfilm',
    fastcut: 'Schnellschnitt',
    tradition: 'Tradition',
    goldenhour: 'Goldene Stunde',
    burger: 'Burger',
    pasta: 'Pasta',
    italian: 'Italienisch',
    social: 'Social',
    creator: 'Creator',
    night: 'Nacht',
    celebration: 'Feier',
    luxury: 'Luxus',
    kitchen: 'Küche',
  },
  ru: {
    food: 'Еда',
    reels: 'Рилс',
    commercial: 'Реклама',
    wedding: 'Свадьбы',
    lifestyle: 'Лайфстайл',
    pizza: 'Пицца',
    artisan: 'Крафт',
    sizzle: 'Сиззл',
    tabletop: 'Тейблтоп',
    craft: 'Мастерство',
    campaign: 'Кампания',
    cinematic: 'Кинематографичный',
    documentary: 'Документальный',
    fastcut: 'Динамичный монтаж',
    tradition: 'Традиции',
    goldenhour: 'Золотой час',
    burger: 'Бургер',
    pasta: 'Паста',
    italian: 'Итальянский',
    social: 'Соцсети',
    creator: 'Криэйтор',
    night: 'Ночь',
    celebration: 'Праздник',
    luxury: 'Премиум',
    kitchen: 'Кухня',
  },
};

export function getLocalizedTag(tag: string, locale: SupportedLocale): string {
  if (locale === 'en' || !locale) return tag;
  const cleanTag = tag.toLowerCase().replace(/^#/, '');
  const translated = TAG_TRANSLATIONS[locale]?.[cleanTag];
  return translated || tag;
}
