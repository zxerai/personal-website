'use client';

import { ReactNode, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { LenisContext } from '@/lib/lenis-context';

const SCROLL_OFFSET = -80; // sticky navbar 高度

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    setLenis(instance);

    function raf(time: number) {
      instance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 全局拦截所有锚点点击（包括 TableOfContents 链接）
    // 这是处理 Lenis 接管滚动的标准模式
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 向上找最近的 <a href="#...">
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      const id = decodeURIComponent(href.slice(1));
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`[Lenis] Anchor target not found: #${id}`);
        return;
      }

      e.preventDefault();
      instance.scrollTo(element, {
        offset: SCROLL_OFFSET,
        duration: 1.0,
      });

      // 同步 URL hash（不触发原生跳转）
      history.replaceState(null, '', href);
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}