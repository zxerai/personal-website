import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBlogPosts } from '@/lib/mdx';
import { BlogCard } from '@/components/blog/BlogCard';
import { FadeIn } from '@/components/motion/FadeIn';
import type { Locale } from '@/lib/utils';

type Props = {
  params: { locale: string };
};

export default async function BlogPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = await getBlogPosts(locale as Locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <FadeIn>
        <header className="mb-12">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 text-text-secondary md:text-lg">{t('subtitle')}</p>
        </header>
      </FadeIn>

      {posts.length === 0 ? (
        <p className="text-text-muted">{t('no_posts')}</p>
      ) : (
        <div className="divide-y divide-border-subtle">
          {posts.map((post, idx) => (
            <FadeIn key={post.slug} delay={idx * 0.04}>
              <BlogCard post={post} locale={locale} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}