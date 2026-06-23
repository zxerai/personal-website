import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { siteConfig, type Locale } from '@/lib/utils';
import { LenisProvider } from '@/components/motion/LenisProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import '@/styles/globals.css';

// 英文字体
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export function generateStaticParams() {
  return siteConfig.supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('hero_name'),
    description: t('hero_description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        zh: '/zh',
        en: '/en',
      },
    },
    openGraph: {
      title: t('hero_name'),
      description: t('hero_description'),
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // 启用静态渲染
  setRequestLocale(locale);

  // 验证 locale
  if (!siteConfig.supportedLocales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="noise-overlay min-h-screen font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LenisProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar locale={locale} />
              <main className="flex-1">{children}</main>
              <Footer locale={locale} />
            </div>
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}