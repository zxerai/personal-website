import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  id?: string;
}

export function Heading({ level = 2, id, children, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';

  const sizes = {
    1: 'mt-12 mb-4 text-3xl md:text-4xl',
    2: 'mt-10 mb-3 text-2xl md:text-3xl',
    3: 'mt-8 mb-2 text-xl md:text-2xl',
    4: 'mt-6 mb-2 text-lg md:text-xl',
  };

  return (
    <Tag
      id={id}
      className={cn(
        'group relative scroll-mt-20 font-display font-semibold tracking-tight text-text-primary',
        sizes[level],
        className
      )}
      {...props}
    >
      {id && (
        <a
          href={`#${id}`}
          aria-label="Anchor link"
          className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <span className="text-accent">#</span>
        </a>
      )}
      {children}
    </Tag>
  );
}