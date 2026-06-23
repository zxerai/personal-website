'use client';

import { useEffect, useState } from 'react';

/**
 * 主页 Hero 背景层：aurora/mesh gradient 风格
 * - 基础柔和渐变 + 4 个大模糊色块（accent + violet + sky + emerald）
 * - 每个色块用 CSS keyframe 慢速漂移（28-35s 循环）
 * - 微弱网格（带 radial mask 中心强边缘弱）+ 噪点叠加
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
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* 基础渐变底色 */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-base via-bg-base to-bg-elevated" />

      {/* 网格底纹（radial mask：中心强、边缘淡出） */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />

      {/* Aurora 色块 1：accent 紫（主色调，左上） */}
      <div
        className={`absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-accent/35 blur-[120px] ${
          reducedMotion ? '' : 'animate-blob-1'
        }`}
      />

      {/* Aurora 色块 2：violet 紫（右上） */}
      <div
        className={`absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-400/25 blur-[140px] ${
          reducedMotion ? '' : 'animate-blob-2'
        }`}
      />

      {/* Aurora 色块 3：sky 蓝（左下） */}
      <div
        className={`absolute -bottom-32 left-1/4 h-[550px] w-[550px] rounded-full bg-sky-300/20 blur-[140px] ${
          reducedMotion ? '' : 'animate-blob-3'
        }`}
      />

      {/* Aurora 色块 4：emerald 绿（角落点缀） */}
      <div
        className={`absolute right-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-emerald-300/15 blur-[100px] ${
          reducedMotion ? '' : 'animate-blob-1'
        }`}
      />

      {/* 中心下方光晕 */}
      <div className="absolute left-1/2 top-3/4 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[150px]" />

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
