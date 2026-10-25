import { ImageResponse } from 'next/og';
import { getAllProjects } from '@/lib/db';

export const runtime = 'nodejs';
export const alt = 'Curated Commercial Video Works — ZYLITCH';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const projects = await getAllProjects(false);
  const totalCount = projects.length || 12;

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
          background: 'linear-gradient(135deg, #240722 0%, #150214 50%, #07080a 100%)',
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
            background: 'radial-gradient(circle, rgba(255, 60, 172, 0.3) 0%, transparent 70%)',
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
            background: 'radial-gradient(circle, rgba(194, 24, 91, 0.22) 0%, transparent 70%)',
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
                fontSize: '40px',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#ffffff',
              }}
            >
              ZYLITCH
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                padding: '6px 14px',
                background: 'rgba(255, 60, 172, 0.15)',
                border: '1px solid rgba(255, 60, 172, 0.35)',
                borderRadius: '999px',
                color: '#ff4f9c',
                textTransform: 'uppercase',
              }}
            >
              GALLERY ARCHIVE
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#ff85b8',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '6px 14px',
                borderRadius: '999px',
              }}
            >
              {totalCount} SELECTED EDITS
            </span>
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '920px',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#ff4f9c',
              textTransform: 'uppercase',
            }}
          >
            Curated Visual Portfolio
          </div>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              margin: 0,
            }}
          >
            High-Impact Video Edits &amp; Brand Stories
          </h1>
          <p
            style={{
              fontSize: '22px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.72)',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Specialized in commercial storytelling, food tabletop sizzles, wedding films &amp; high-retention social campaigns.
          </p>
        </div>

        {/* Bottom Format Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            {['9:16 VERTICAL REELS', '16:9 CINEMA', '1:1 TABLETOP', 'DAVINCI RESOLVE'].map((pill) => (
              <span
                key={pill}
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '999px',
                  color: '#ffffff',
                }}
              >
                {pill}
              </span>
            ))}
          </div>

          <span
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            zylitch.in/work
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
