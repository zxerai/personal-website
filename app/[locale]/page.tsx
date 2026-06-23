import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { RecentBlog } from '@/components/home/RecentBlog';
import { getProjects, getBlogPosts } from '@/lib/mdx';
import type { Locale } from '@/lib/utils';

type Props = {
  params: { locale: string };
};

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  const projects = (await getProjects(locale as Locale))
    .filter((p) => p.featured)
    .slice(0, 3);
  const posts = (await getBlogPosts(locale as Locale)).slice(0, 3);

  return (
    <>
      <Hero locale={locale} />
      <FeaturedProjects projects={projects} locale={locale} />
      <RecentBlog posts={posts} locale={locale} />
    </>
  );
}