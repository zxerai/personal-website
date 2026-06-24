'use client';

import { useEffect, useState } from 'react';

/**
 * 主页 Hero 背景层：单色 Aurora（Stripe 风格）
 * - 基础柔和渐变 + 2 个大模糊色块（同色系 indigo + violet 浅）
 * - 极慢漂移（60-80s）—— 几乎不动但能感觉到活着
 * - 微弱网格 + 中心下方光晕 + 四角 vignette + 噪点
 * - prefers-reduced-motion 时静态显示
 */
export function HeroBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* 基础渐变：纯白→淡灰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-base via-bg-base to-bg-elevated" />

      {/* 网格底纹（更淡） */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at center, black 25%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 25%, transparent 75%)',
        }}
      />

      {/* Aurora 主色块：accent indigo（左上） */}
      <div
        className={`absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-accent/25 blur-[140px] ${
          reducedMotion ? '' : 'animate-blob-1'
        }`}
      />

      {/* Aurora 副色块：violet 浅紫（右下，更小更淡） */}
      <div
        className={`absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-violet-300/20 blur-[140px] ${
          reducedMotion ? '' : 'animate-blob-2'
        }`}
      />

      {/* 中心下方光晕（极淡，聚焦 Hero 文字） */}
      <div className="absolute left-1/2 top-2/3 h-[400px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[160px]" />

      {/* Vignette：四角暗角，让中心 Hero 文字更聚焦 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.04) 100%)',
        }}
      />

      {/* 噪点叠加 */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}