import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'ZYLITCH — Commercial Video Editor & Visual Storyteller';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
        {/* Soft Ambient Background Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-150px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 60, 172, 0.25) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(194, 24, 91, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Top Header Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{
                fontSize: '44px',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#240722',
              }}
            >
              ZYLITCH
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                padding: '6px 14px',
                background: 'rgba(36, 7, 34, 0.08)',
                border: '1px solid rgba(36, 7, 34, 0.12)',
                borderRadius: '999px',
                color: '#c2185b',
                textTransform: 'uppercase',
              }}
            >
              STUDIO PORTFOLIO
            </span>
          </div>

          <span
            style={{
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#8a3b5c',
            }}
          >
            zylitch.in
          </span>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '900px',
          }}
        >
          <h1
            style={{
              fontSize: '66px',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: '#240722',
              margin: 0,
            }}
          >
            Commercial Video Editor &amp; Visual Storyteller
          </h1>
          <p
            style={{
              fontSize: '24px',
              fontWeight: 400,
              color: '#6b1442',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            High-retention commercial promos, food cinematography sizzles, wedding films &amp; DaVinci Resolve color grading.
          </p>
        </div>

        {/* Bottom Feature Tags */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            {['#COMMERCIALS', '#FOODSIZZLE', '#REELS', '#COLORGRADING'].map((pill) => (
              <span
                key={pill}
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '8px 18px',
                  background: 'rgba(255, 255, 255, 0.75)',
                  border: '1px solid rgba(255, 79, 156, 0.3)',
                  borderRadius: '999px',
                  color: '#ff4f9c',
                  boxShadow: '0 4px 12px rgba(255, 79, 156, 0.12)',
                }}
              >
                {pill}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#8a3b5c',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            <span>hello@zylitch.in</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
