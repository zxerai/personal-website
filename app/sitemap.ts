import type { MetadataRoute } from 'next';
import { siteConfig, type Locale } from '@/lib/utils';
import { getProjects, getBlogPosts } from '@/lib/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of siteConfig.supportedLocales) {
    routes.push(
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1,
        alternates: {
          languages: {
            zh: `${baseUrl}/zh`,
            en: `${baseUrl}/en`,
          },
        },
      },
      {
        url: `${baseUrl}/${locale}/projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/resume`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/${locale}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }
    );
  }

  for (const locale of siteConfig.supportedLocales) {
    const projects = await getProjects(locale as Locale);
    for (const project of projects) {
      routes.push({
        url: `${baseUrl}/${locale}/projects/${project.slug}`,
        lastModified: new Date(project.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  for (const locale of siteConfig.supportedLocales) {
    const posts = await getBlogPosts(locale as Locale);
    for (const post of posts) {
      routes.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return routes;
}