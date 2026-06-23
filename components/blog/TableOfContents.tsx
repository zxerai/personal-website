'use client';

import { useEffect, useState } from 'react';
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
  const t = useTranslations('blog');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-24">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-text-muted">
        {t('table_of_contents')}
      </h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              'border-l-2 pl-3 transition-colors',
              heading.level === 3 && 'ml-3',
              activeId === heading.id
                ? 'border-accent text-text-primary'
                : 'border-border-subtle text-text-muted hover:text-text-secondary'
            )}
          >
            <a href={`#${heading.id}`} className="block leading-snug">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}