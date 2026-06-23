import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getProjects } from '@/lib/mdx';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { FadeIn } from '@/components/motion/FadeIn';
import type { Locale } from '@/lib/utils';

type Props = {
  params: { locale: string };
};

export default async function ProjectsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });
  const projects = await getProjects(locale as Locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <FadeIn>
        <header className="mb-12">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 text-text-secondary md:text-lg">{t('subtitle')}</p>
        </header>
      </FadeIn>

      {projects.length === 0 ? (
        <p className="text-text-muted">{t('no_projects')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <FadeIn key={project.slug} delay={idx * 0.05}>
              <ProjectCard project={project} locale={locale} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
