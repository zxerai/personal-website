'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Magnetic } from '@/components/motion/Magnetic';
import { Typewriter } from '@/components/motion/FadeIn';

interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
        {value}
      </span>
      <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
        {label}
      </span>
    </div>
  );
}

export function Hero({ locale: _locale }: { locale: string }) {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-36">
        <div className="max-w-3xl">
          {/* 状态徽章 */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-elevated/60 px-3 py-1.5 text-xs backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono uppercase tracking-wider text-text-secondary">
              Available for work
            </span>
          </div>

          {/* Greeting */}
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            <Typewriter text={t('hero_greeting')} delay={0.1} />
          </p>

          {/* 主名字（带渐变） */}
          <h1
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
            style={{
              background: 'linear-gradient(135deg, #18181b 0%, #4f46e5 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('hero_name')}
          </h1>

          {/* Tagline */}
          <p className="mt-6 font-display text-2xl font-light text-text-secondary md:text-3xl">
            <Typewriter text={t('hero_tagline')} delay={0.5} />
          </p>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            {t('hero_description')}
          </p>

          {/* CTA 按钮 */}
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

          {/* 统计数字条 */}
          <div className="mt-14 grid max-w-md grid-cols-3 gap-6 border-y border-border-subtle py-6">
            <Stat value="7" label="Years" />
            <Stat value="1" label="Projects" />
            <Stat value="1" label="Articles" />
          </div>
        </div>
      </div>
    </section>
  );
}
