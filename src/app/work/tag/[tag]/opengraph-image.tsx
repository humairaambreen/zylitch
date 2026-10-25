import { ImageResponse } from 'next/og';
import { getAllProjects } from '@/lib/db';
import { extractHashtags } from '@/lib/defaultPins';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ tag: string }>;
}

export default async function Image({ params }: Props) {
  const { tag } = await params;
  const cleanTag = decodeURIComponent(tag).toLowerCase().replace(/^#/, '');

  const allProjects = await getAllProjects(false);
  const matchingProjects = allProjects.filter((p) => {
    const tags = p.tags && p.tags.length > 0 ? p.tags : extractHashtags(p.description || '');
    return tags.some((t) => t.toLowerCase() === cleanTag) || p.description?.toLowerCase().includes(`#${cleanTag}`);
  });

  const count = matchingProjects.length;

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
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-150px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 79, 156, 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Top Bar */}
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
                fontSize: '38px',
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
              TAG ARCHIVE
            </span>
          </div>

          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              padding: '6px 16px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              color: '#ffd6e8',
            }}
          >
            {count} {count === 1 ? 'PROJECT' : 'PROJECTS'}
          </span>
        </div>

        {/* Center Tag Heading */}
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
              letterSpacing: '0.12em',
              color: '#ff4f9c',
              textTransform: 'uppercase',
            }}
          >
            Hashtag Portfolio Collection
          </div>

          <h1
            style={{
              fontSize: '76px',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              margin: 0,
            }}
          >
            #{cleanTag.toUpperCase()}
          </h1>

          <p
            style={{
              fontSize: '22px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Curated commercial video edits, high-retention social reels, and storytelling categorized under #{cleanTag}.
          </p>
        </div>

        {/* Bottom Info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Commercial Video Production • DaVinci Resolve
          </span>

          <span
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            zylitch.in/work/tag/{cleanTag}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
