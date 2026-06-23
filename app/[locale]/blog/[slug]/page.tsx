import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBlogPost, getBlogPosts } from '@/lib/mdx';
import { siteConfig, calculateReadingTime, formatDate, type Locale } from '@/lib/utils';
import { mdxComponents } from '@/components/mdx/MDXComponents';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { FadeIn } from '@/components/motion/FadeIn';

type Props = {
  params: { locale: string; slug: string };
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of siteConfig.supportedLocales) {
    const posts = await getBlogPosts(locale as Locale);
    params.push(...posts.map((p) => ({ locale, slug: p.slug })));
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const post = await getBlogPost(params.slug, params.locale as Locale);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  setRequestLocale(params.locale);
  const post = await getBlogPost(params.slug, params.locale as Locale);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;
  const t = await getTranslations({ locale: params.locale, namespace: 'blog' });

  const readingTime = calculateReadingTime(content);

  return (
    <article className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <FadeIn>
        <Link
          href={`/${params.locale}/blog`}
          className="link-underline mb-8 inline-block text-sm text-text-muted hover:text-accent"
        >
          ← {t('back_to_blog')}
        </Link>
      </FadeIn>

      <div className="grid gap-12 lg:grid-cols-[1fr_220px]">
        <div>
          <FadeIn>
            <header className="mb-12 border-b border-border-subtle pb-8">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-text-muted">
                <time className="font-mono uppercase tracking-wider">
                  {formatDate(frontmatter.date, params.locale === 'zh' ? 'zh-CN' : 'en-US')}
                </time>
                <span>·</span>
                <span>
                  {readingTime} {t('reading_time')}
                </span>
              </div>

              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                {frontmatter.title}
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-text-secondary md:text-xl">
                {frontmatter.description}
              </p>

              {frontmatter.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-bg-elevated px-2.5 py-1 font-mono text-xs text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="prose prose-invert max-w-none">
              <MDXRemote source={content} components={mdxComponents} />
            </div>
          </FadeIn>
        </div>

        <aside className="hidden lg:block">
          <TableOfContents headings={[]} />
        </aside>
      </div>
    </article>
  );
}
