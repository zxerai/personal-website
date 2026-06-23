import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';

export default function NotFound() {
  const t = useTranslations('404');

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <FadeIn className="text-center">
        <div className="font-display text-[8rem] font-bold leading-none tracking-tighter text-accent md:text-[12rem]">
          404
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold md:text-3xl">{t('title')}</h1>
        <p className="mt-2 text-text-secondary">{t('description')}</p>

        <Link
          href="/zh"
          className="mt-8 inline-flex items-center gap-2 rounded border border-border-default px-5 py-2.5 text-sm transition-all hover:border-accent hover:bg-bg-elevated hover:text-accent"
        >
          ← {t('back_home')}
        </Link>
      </FadeIn>
    </div>
  );
}
