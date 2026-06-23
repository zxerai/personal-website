import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { siteConfig } from './utils';

export default getRequestConfig(async ({ locale }) => {
  // 验证 locale
  if (!siteConfig.supportedLocales.includes(locale as any)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});