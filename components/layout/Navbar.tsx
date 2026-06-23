'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const navItems = [
    { key: 'home', href: `/${locale}` },
    { key: 'projects', href: `/${locale}/projects` },
    { key: 'blog', href: `/${locale}/blog` },
    { key: 'resume', href: `/${locale}/resume` },
    { key: 'about', href: `/${locale}/about` },
  ];

  return (
    <header className="glass sticky top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={`/${locale}`}
          className="font-display text-lg font-semibold tracking-tight text-text-primary transition-colors hover:text-accent"
        >
          jiaiiac<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.key === 'home'
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'relative rounded px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {t(item.key as any)}
                {isActive && (
                  <span className="absolute -bottom-px left-3 right-3 h-px bg-accent" />
                )}
              </Link>
            );
          })}

          <div className="ml-2 border-l border-border-subtle pl-2">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </nav>
    </header>
  );
}