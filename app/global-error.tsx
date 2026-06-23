'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh">
      <body
        style={{
          backgroundColor: '#0a0a0b',
          color: '#ededee',
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#6366f1',
            }}
          >
            Critical Error
          </div>
          <p style={{ marginTop: '16px', color: '#a0a0a8' }}>
            {error.message || 'A critical error occurred'}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '32px',
              padding: '10px 20px',
              background: 'transparent',
              color: '#ededee',
              border: '1px solid #2a2a30',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Reset
          </button>
        </div>
      </body>
    </html>
  );
}
