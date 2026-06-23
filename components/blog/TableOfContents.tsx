'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const t = useTranslations('blog');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 跟踪滚动进度 + 同步 active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      setProgress(pct);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // IntersectionObserver: 跟踪当前可见的 heading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observerRef.current?.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const h2Count = headings.filter((h) => h.level === 2).length;
  const h3Count = headings.length - h2Count;

  return (
    <nav aria-label="Table of contents" className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 -mr-2 scrollbar-thin">
      {/* 阅读进度条 */}
      <div className="mb-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            {t('table_of_contents')}
          </h2>
          <span className="font-mono text-[10px] text-text-muted">
            {h2Count} {h2Count === 1 ? 'section' : 'sections'}
            {h3Count > 0 && ` · ${h3Count}`}
          </span>
        </div>
        <div className="h-px w-full overflow-hidden rounded-full bg-border-subtle">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 目录列表 */}
      <ul className="space-y-px text-[13px]">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const isH3 = heading.level === 3;

          return (
            <li
              key={heading.id}
              className={cn(
                'relative',
                isH3 && 'ml-3.5'
              )}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  'block border-l-2 py-1.5 pl-3 pr-2 leading-snug transition-all duration-200',
                  'scroll-mt-24',
                  isActive
                    ? 'border-accent bg-accent/5 text-text-primary font-medium'
                    : 'border-transparent text-text-muted hover:border-border-default hover:bg-bg-overlay/40 hover:text-text-secondary',
                  isH3 && !isActive && 'text-text-muted/80'
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>

      {/* 底部装饰：返回顶部 */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'mt-6 inline-flex items-center gap-1.5 rounded border border-border-subtle px-2.5 py-1',
          'font-mono text-[10px] uppercase tracking-wider text-text-muted transition-colors',
          'hover:border-accent hover:text-accent'
        )}
      >
        ↑ Top
      </button>
    </nav>
  );
}