import Link from 'next/link';
import type { BlogPost } from '@/lib/schemas/blog';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  locale: string;
}

export function BlogCard({ post, locale }: BlogCardProps) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex flex-col gap-4 rounded border border-transparent px-4 py-5 transition-all hover:border-border-subtle hover:bg-bg-elevated md:flex-row md:items-start md:gap-8"
    >
      <time className="font-mono text-xs uppercase tracking-wider text-text-muted md:w-32 md:shrink-0 md:pt-1">
        {formatDate(post.date, locale === 'zh' ? 'zh-CN' : 'en-US')}
      </time>

      <div className="flex-1">
        <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {post.description}
        </p>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-bg-overlay px-2 py-0.5 font-mono text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <span className="hidden text-text-muted transition-colors group-hover:text-accent md:block">
        →
      </span>
    </Link>
  );
}
