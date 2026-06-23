import createMiddleware from 'next-intl/middleware';
import { siteConfig } from './lib/utils';

export default createMiddleware({
  locales: siteConfig.supportedLocales as unknown as string[],
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: 'always',
});

export const config = {
  // 匹配所有路径，除了 api、_next、_vercel、含扩展名的文件
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};