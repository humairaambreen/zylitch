import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '1rem',
        color: 'var(--pink-deep)',
        backgroundColor: 'var(--pink-bg)',
      }}
    >
      <h2 style={{ fontSize: '2rem', fontFamily: 'Satoshi, sans-serif' }}>404 - Not Found</h2>
      <Link
        href="/"
        style={{
          color: 'var(--pink-primary)',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
