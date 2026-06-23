import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '个人作品集';
  const description = searchParams.get('description') || 'AI 工程师 / 构建智能应用';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#0a0a0b',
          backgroundImage:
            'radial-gradient(circle at 80% 100%, rgba(99, 102, 241, 0.3), transparent 60%)',
          color: '#ededee',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '20px',
            color: '#6366f1',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#6366f1',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)',
            }}
          />
          jiaiiac.dev
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: '900px',
              marginBottom: '24px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#a0a0a8',
              lineHeight: 1.4,
              maxWidth: '800px',
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '18px',
            color: '#6b6b73',
          }}
        >
          <span>AI Engineer</span>
          <span>·</span>
          <span>Building Intelligent Applications</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}