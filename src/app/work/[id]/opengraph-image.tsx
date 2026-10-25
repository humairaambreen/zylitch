import { ImageResponse } from 'next/og';
import { getProjectById } from '@/lib/db';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#240722',
            color: '#ffffff',
            fontSize: '48px',
            fontWeight: 800,
            fontFamily: 'sans-serif',
          }}
        >
          ZYLITCH — Project Not Found
        </div>
      ),
      { ...size }
    );
  }

  const categoryLabel = (project.category || 'COMMERCIAL').toUpperCase();
  const isVertical = project.aspect === 'vertical';
  const ratioLabel = isVertical ? '9:16 VERTICAL' : project.aspect === 'square' ? '1:1 SQUARE' : '16:9 CINEMA';

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
          background: 'linear-gradient(135deg, #1f061d 0%, #110210 50%, #07080a 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow Spheres */}
        <div
          style={{
            position: 'absolute',
            top: '-140px',
            right: '-140px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 79, 156, 0.32) 0%, transparent 70%)',
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
            background: 'radial-gradient(circle, rgba(194, 24, 91, 0.2) 0%, transparent 70%)',
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
                fontSize: '36px',
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
                background: 'rgba(255, 79, 156, 0.15)',
                border: '1px solid rgba(255, 79, 156, 0.35)',
                borderRadius: '999px',
                color: '#ff4f9c',
                textTransform: 'uppercase',
              }}
            >
              {categoryLabel}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                color: '#ffd6e8',
              }}
            >
              {ratioLabel}
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                color: '#ffffff',
              }}
            >
              {project.duration || '0:15'}
            </span>
          </div>
        </div>

        {/* Center Content: Title & Specs */}
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
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#ff4f9c',
              textTransform: 'uppercase',
            }}
          >
            Client: {project.client || 'Featured Commercial'}
          </div>

          <h1
            style={{
              fontSize: '60px',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              margin: 0,
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              fontSize: '20px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Bottom Bar: Tags & Audio Specs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            {(project.tags || []).slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '7px 14px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '999px',
                  color: 'rgba(255, 255, 255, 0.85)',
                }}
              >
                #{tag.replace(/^#/, '')}
              </span>
            ))}
          </div>

          <span
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            zylitch.in/work/{project.id}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
