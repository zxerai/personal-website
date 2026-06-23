'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Magnetic } from '@/components/motion/Magnetic';
import { Typewriter } from '@/components/motion/FadeIn';

export function Hero({ locale: _locale }: { locale: string }) {
  const t = useTranslations('home');
  const titleRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // 鼠标位置 → 3D 倾斜角度（用 spring 平滑）
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], ['6deg', '-6deg']), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], ['-6deg', '6deg']), {
    stiffness: 180,
    damping: 22,
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !titleRef.current) return;
    const rect = titleRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 md:pt-40">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent">
            <Typewriter text={t('hero_greeting')} delay={0.1} />
          </p>

          {/* 3D 标题容器 */}
          <div
            ref={titleRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1200px' }}
            className="relative"
          >
            {/* 3D 倾斜 + 浮雕文字 */}
            <motion.h1
              style={{
                rotateX: reducedMotion ? 0 : rotateX,
                rotateY: reducedMotion ? 0 : rotateY,
                transformStyle: 'preserve-3d',
              }}
              className={`text-3d font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl ${
                reducedMotion ? '' : 'animate-float'
              }`}
            >
              {/* 渐变文字（黑 → 紫，避免 bg-clip-text 失效） */}
              <span
                style={{
                  background: 'linear-gradient(135deg, #18181b 0%, #18181b 60%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <Typewriter text={t('hero_name')} delay={0.2} />
              </span>
            </motion.h1>
          </div>

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