import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAbout } from '@/lib/mdx';
import type { Locale } from '@/lib/utils';
import { mdxComponents } from '@/components/mdx/MDXComponents';
import { FadeIn } from '@/components/motion/FadeIn';

type Props = {
  params: { locale: string };
};

export default async function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  const about = await getAbout(locale as Locale);

  if (!about) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-text-muted">About not available</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <FadeIn>
        <header className="mb-12">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 text-text-secondary md:text-lg">{t('subtitle')}</p>
        </header>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="prose prose-invert max-w-none">
          <MDXRemote
          source={about.content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
        </div>
      </FadeIn>
    </div>
  );
}
