import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/utils';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('home');

  return (
    <footer className="mt-32 border-t border-border-subtle">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-display text-base font-semibold text-text-primary">
              {siteConfig.name}
            </p>
            <p className="mt-1 text-sm text-text-muted">{siteConfig.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-text-muted">{t('lets_connect')}:</span>
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-text-secondary hover:text-accent"
              >
                GitHub
              </a>
            )}
            {siteConfig.social.email && (
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="link-underline text-text-secondary hover:text-accent"
              >
                Email
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-border-subtle pt-6 text-xs text-text-muted md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built with Next.js · {locale === 'zh' ? '中文' : 'English'}</p>
        </div>
      </div>
    </footer>
  );
}
