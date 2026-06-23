import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名，处理冲突
 * 例：cn('px-4', condition && 'py-2', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期为本地化字符串
 */
export function formatDate(date: string | Date, locale: string = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 计算阅读时长（分钟）
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  // 中英文混合：按字符数估算
  const wordCount = content.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * 站点配置常量
 */
export const siteConfig = {
  name: '个人作品集',
  description: 'AI 工程师 / 构建智能应用',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  defaultLocale: 'zh' as const,
  supportedLocales: ['zh', 'en'] as const,
  social: {
    github: 'https://github.com/jiaiiac',
    twitter: '',
    email: 'hi@example.com',
  },
} as const;

export type Locale = (typeof siteConfig.supportedLocales)[number];
