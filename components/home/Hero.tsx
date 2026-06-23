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
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], ['8deg', '-8deg']), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], ['-8deg', '8deg']), {
    stiffness: 150,
    damping: 20,
  });
  // 光泽跟随鼠标
  const sheenX = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%']);
  const sheenY = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%']);

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
            {/* 静态装饰层（光晕） */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-4 -z-10 rounded-3xl opacity-60 blur-3xl"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.18), transparent 70%)',
              }}
            />

            {/* 3D 倾斜 + 浮雕文字 */}
            <motion.h1
              style={{
                rotateX: reducedMotion ? 0 : rotateX,
                rotateY: reducedMotion ? 0 : rotateY,
                transformStyle: 'preserve-3d',
              }}
              className={`font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl text-3d ${
                reducedMotion ? '' : 'animate-float'
              }`}
            >
              {/* 渐变文字层（用 mask 实现，避免 bg-clip-text 破坏子元素） */}
              <span
                className="bg-gradient-to-br from-text-primary via-text-primary to-accent bg-clip-text text-transparent"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <Typewriter text={t('hero_name')} delay={0.2} />
              </span>

              {/* 鼠标光泽叠加层（仅 reduce motion 不启用时显示） */}
              {!reducedMotion && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(255,255,255,0.7) 0%, transparent 40%)',
                    backgroundSize: '200% 200%',
                    backgroundPosition: `${sheenX.get()} ${sheenY.get()}`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mixBlendMode: 'overlay',
                  }}
                >
                  <Typewriter text={t('hero_name')} delay={0.2} />
                </motion.span>
              )}
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