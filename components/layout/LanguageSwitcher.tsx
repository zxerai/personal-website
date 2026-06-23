'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { siteConfig, type Locale } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    const segments = pathname?.split('/') || [];
    if (segments[1] && siteConfig.supportedLocales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.unshift('', newLocale);
    }
    const newPath = segments.join('/') || `/${newLocale}`;

    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      {siteConfig.supportedLocales.map((locale, idx) => (
        <span key={locale} className="flex items-center">
          <button
            type="button"
            onClick={() => switchLocale(locale)}
            disabled={isPending}
            aria-label={`Switch to ${locale === 'zh' ? 'Chinese' : 'English'}`}
            className={cn(
              'rounded px-2 py-1 font-mono uppercase tracking-wider transition-colors',
              currentLocale === locale ? 'text-accent' : 'text-text-muted hover:text-text-primary',
              isPending && 'opacity-50'
            )}
          >
            {locale}
          </button>
          {idx < siteConfig.supportedLocales.length - 1 && (
            <span className="text-text-muted/40">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
