import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { Project } from '@/lib/schemas/project';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { FadeIn } from '@/components/motion/FadeIn';

interface FeaturedProjectsProps {
  projects: Project[];
  locale: string;
}

export function FeaturedProjects({ projects, locale }: FeaturedProjectsProps) {
  const t = useTranslations('home');

  if (projects.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <FadeIn className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {t('featured_projects')}
        </h2>
        <Link
          href={`/${locale}/projects`}
          className="link-underline text-sm text-text-secondary hover:text-accent"
        >
          {t('view_all_projects')} →
        </Link>
      </FadeIn>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <FadeIn key={project.slug} delay={idx * 0.1}>
            <ProjectCard project={project} locale={locale} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
