'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Magnetic } from '@/components/motion/Magnetic';
import { Typewriter } from '@/components/motion/FadeIn';

export function Hero({ locale: _locale }: { locale: string }) {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden">
      {/* 网格背景 */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.03] [background-image:linear-gradient(to_right,#ededee_1px,transparent_1px),linear-gradient(to_bottom,#ededee_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 md:pt-40">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">
            <Typewriter text={t('hero_greeting')} delay={0.1} />
          </p>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            <span className="text-gradient">
              <Typewriter text={t('hero_name')} delay={0.2} />
            </span>
          </h1>

          <p className="mt-6 font-display text-2xl font-light text-text-secondary md:text-3xl">
            <Typewriter text={t('hero_tagline')} delay={0.5} />
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            {t('hero_description')}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic strength={0.2}>
              <Link href={`/${_locale}/projects`}>
                <Button variant="primary" size="lg">
                  {t('cta_projects')}
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </Magnetic>

            <Magnetic strength={0.2}>
              <Link href={`/${_locale}/blog`}>
                <Button variant="secondary" size="lg">
                  {t('cta_blog')}
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
