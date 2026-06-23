'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <div className="font-display text-6xl font-bold text-accent">!</div>
        <h2 className="mt-4 font-display text-2xl font-semibold">页面出错了</h2>
        <p className="mt-2 max-w-md text-sm text-text-muted">
          {error.message || 'An unexpected error occurred'}
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded border border-border-default px-5 py-2.5 text-sm transition-colors hover:border-accent hover:bg-bg-elevated hover:text-accent"
          >
            重试
          </button>
          <Link
            href="/zh"
            className="rounded border border-border-default px-5 py-2.5 text-sm transition-colors hover:border-accent hover:bg-bg-elevated hover:text-accent"
          >
            回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}