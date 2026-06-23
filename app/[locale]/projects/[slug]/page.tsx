import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getProject, getProjects } from '@/lib/mdx';
import { siteConfig, formatDate, type Locale } from '@/lib/utils';
import { mdxComponents } from '@/components/mdx/MDXComponents';
import { FadeIn } from '@/components/motion/FadeIn';

type Props = {
  params: { locale: string; slug: string };
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of siteConfig.supportedLocales) {
    const projects = await getProjects(locale as Locale);
    params.push(...projects.map((p) => ({ locale, slug: p.slug })));
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const project = await getProject(params.slug, params.locale as Locale);
  if (!project) return {};

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.description,
    openGraph: {
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      type: 'article',
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  setRequestLocale(params.locale);
  const project = await getProject(params.slug, params.locale as Locale);

  if (!project) {
    notFound();
  }

  const { frontmatter, content } = project;
  const t = await getTranslations({ locale: params.locale, namespace: 'projects' });

  return (
    <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <FadeIn>
        <Link
          href={`/${params.locale}/projects`}
          className="link-underline mb-8 inline-block text-sm text-text-muted hover:text-accent"
        >
          ← {t('title')}
        </Link>

        <header className="mb-12 border-b border-border-subtle pb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <time className="font-mono uppercase tracking-wider">
              {formatDate(frontmatter.date, params.locale === 'zh' ? 'zh-CN' : 'en-US')}
            </time>
            <span>·</span>
            <span>{frontmatter.tags.join(' · ')}</span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {frontmatter.title}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-text-secondary md:text-xl">
            {frontmatter.description}
          </p>

          {frontmatter.external && (
            <div className="mt-6 flex gap-3">
              <a
                href={frontmatter.external}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-border-default px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {t('view_code')} ↗
              </a>
            </div>
          )}
        </header>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="prose prose-invert max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </FadeIn>
    </article>
  );
}