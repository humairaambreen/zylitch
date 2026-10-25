import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getProjectById } from '@/lib/db';
import { SITE_URL } from '@/lib/seo';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'home';
  const id = searchParams.get('id');
  const tag = searchParams.get('tag');
  const locale = searchParams.get('locale') || 'en';
  const ratio = searchParams.get('ratio') || '16:9';

  // Determine canvas dimensions based on requested aspect ratio
  let width = 1200;
  let height = 630;
  if (ratio === '1:1') {
    width = 1080;
    height = 1080;
  } else if (ratio === '9:16') {
    width = 1080;
    height = 1920;
  }

  // Localized sub-headings
  const localizedBadges: Record<string, string> = {
    ko: '질리치 • 크리에이티브 비디오 에디터',
    ja: 'ジリッチ • クリエイティブ ビデオ エディター',
    es: 'ZYLITCH • EDITOR DE VÍDEO COMERCIAL',
    fr: 'ZYLITCH • MONTEUR VIDÉO CRÉATIF',
    de: 'ZYLITCH • KREATIVER VIDEO-EDITOR',
    ru: 'ZYLITCH • КРЕАТИВНЫЙ ВИДЕОМОНТАЖ',
    en: 'ZYLITCH • COMMERCIAL VIDEO EDITOR',
  };
  const activeBadge = localizedBadges[locale] || localizedBadges.en;

  // 1. Individual Post Mode
  if (type === 'post' && id) {
    const project = await getProjectById(id);
    if (project) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '60px 70px',
              background: 'linear-gradient(135deg, #ffeef5 0%, #ffd4e5 50%, #ffbedb 100%)',
              fontFamily: 'sans-serif',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient Background Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-150px',
                right: '-150px',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 60, 172, 0.28) 0%, transparent 70%)',
              }}
            />

            {/* Top Bar: Wordmark + Category Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span
                  style={{
                    fontSize: '36px',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: '#240722',
                  }}
                >
                  ZYLITCH
                </span>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    padding: '6px 14px',
                    background: 'rgba(36, 7, 34, 0.08)',
                    border: '1px solid rgba(36, 7, 34, 0.15)',
                    borderRadius: '999px',
                    color: '#ff3cac',
                    textTransform: 'uppercase',
                  }}
                >
                  {project.category}
                </span>
              </div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: 'rgba(36, 7, 34, 0.65)',
                }}
              >
                {activeBadge}
              </span>
            </div>

            {/* Middle: Title & Client Context */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', zIndex: 10 }}>
              {project.client && (
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#ff3cac',
                    textTransform: 'uppercase',
                  }}
                >
                  CLIENT — {project.client}
                </span>
              )}
              <h1
                style={{
                  fontSize: '56px',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  color: '#240722',
                  margin: 0,
                  maxWidth: '1000px',
                }}
              >
                {project.title}
              </h1>
              <p
                style={{
                  fontSize: '20px',
                  lineHeight: 1.4,
                  color: 'rgba(36, 7, 34, 0.78)',
                  margin: 0,
                  maxWidth: '900px',
                }}
              >
                {project.description.slice(0, 160)}
                {project.description.length > 160 ? '...' : ''}
              </p>
            </div>

            {/* Bottom Bar: Tags & Editorial Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {project.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      padding: '6px 14px',
                      background: 'rgba(255, 255, 255, 0.75)',
                      border: '1px solid rgba(255, 60, 172, 0.25)',
                      borderRadius: '999px',
                      color: '#240722',
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(36, 7, 34, 0.6)' }}>
                  Runtime: {project.duration}
                </span>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#240722',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    border: '1px solid rgba(36, 7, 34, 0.12)',
                  }}
                >
                  zylitch.in
                </span>
              </div>
            </div>
          </div>
        ),
        { width, height }
      );
    }
  }

  // 2. Tag Archive Mode
  if (type === 'tag' && tag) {
    const cleanTag = decodeURIComponent(tag).toUpperCase().replace(/^#/, '');
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 70px',
            background: 'linear-gradient(135deg, #ffeef5 0%, #ffd4e5 50%, #ffbedb 100%)',
            fontFamily: 'sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <span style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.04em', color: '#240722' }}>
              ZYLITCH
            </span>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '6px 16px',
                background: '#ff3cac',
                borderRadius: '999px',
                color: '#ffffff',
              }}
            >
              PORTFOLIO ARCHIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.1em', color: '#ff3cac' }}>
              FEATURED CATEGORY
            </span>
            <h1 style={{ fontSize: '76px', fontWeight: 900, letterSpacing: '-0.04em', color: '#240722', margin: 0 }}>
              #{cleanTag}
            </h1>
            <p style={{ fontSize: '24px', color: 'rgba(36, 7, 34, 0.8)', margin: 0 }}>
              High-impact commercial video editing, brand reels, and color grading.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(36, 7, 34, 0.65)' }}>
              {activeBadge}
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#240722',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '10px 22px',
                borderRadius: '999px',
                border: '1px solid rgba(36, 7, 34, 0.12)',
              }}
            >
              zylitch.in/work/tag/{cleanTag.toLowerCase()}
            </span>
          </div>
        </div>
      ),
      { width, height }
    );
  }

  // 3. Work Archive / Default Home Mode
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          background: 'linear-gradient(135deg, #ffeef5 0%, #ffd4e5 50%, #ffbedb 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <span style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.04em', color: '#240722' }}>
            ZYLITCH
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '6px 16px',
              background: 'rgba(36, 7, 34, 0.08)',
              border: '1px solid rgba(36, 7, 34, 0.16)',
              borderRadius: '999px',
              color: '#ff3cac',
            }}
          >
            4+ YEARS OBSESSIVE CRAFT
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.12em', color: '#ff3cac' }}>
            COMMERCIAL & SOCIAL VIDEO EDITOR
          </span>
          <h1 style={{ fontSize: '64px', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#240722', margin: 0 }}>
            Visual Storytelling with Scroll-Stopping Impact.
          </h1>
          <p style={{ fontSize: '22px', color: 'rgba(36, 7, 34, 0.8)', margin: 0 }}>
            Dynamic talking heads, luxury lifestyle, tabletop food sizzle, and high-energy social campaigns.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, padding: '6px 14px', background: '#ffffff', borderRadius: '999px', color: '#240722' }}>
              #COMMERCIAL
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, padding: '6px 14px', background: '#ffffff', borderRadius: '999px', color: '#240722' }}>
              #REELS
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, padding: '6px 14px', background: '#ffffff', borderRadius: '999px', color: '#240722' }}>
              #FOOD
            </span>
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#240722',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '10px 24px',
              borderRadius: '999px',
              border: '1px solid rgba(36, 7, 34, 0.12)',
            }}
          >
            https://zylitch.in
          </span>
        </div>
      </div>
    ),
    { width, height }
  );
}
