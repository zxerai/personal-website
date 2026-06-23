import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { BlogPost } from '@/lib/schemas/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { FadeIn } from '@/components/motion/FadeIn';

interface RecentBlogProps {
  posts: BlogPost[];
  locale: string;
}

export function RecentBlog({ posts, locale }: RecentBlogProps) {
  const t = useTranslations('home');

  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <FadeIn className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {t('recent_blog')}
        </h2>
        <Link
          href={`/${locale}/blog`}
          className="link-underline text-sm text-text-secondary hover:text-accent"
        >
          {t('view_all_blog')} →
        </Link>
      </FadeIn>

      <div className="space-y-3">
        {posts.map((post, idx) => (
          <FadeIn key={post.slug} delay={idx * 0.08}>
            <BlogCard post={post} locale={locale} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
