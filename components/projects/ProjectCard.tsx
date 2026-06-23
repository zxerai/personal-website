import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Project } from '@/lib/schemas/project';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  locale: string;
  featured?: boolean;
}

export function ProjectCard({ project, locale, featured }: ProjectCardProps) {
  const t = useTranslations('projects');

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className={cn(
        'group block h-full rounded border border-border-subtle bg-bg-elevated p-6 transition-all duration-300',
        'hover:-translate-y-1 hover:border-accent/40 hover:shadow-elevated'
      )}
    >
      {featured && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          Featured
        </div>
      )}

      <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent">
        {project.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded bg-bg-overlay px-2 py-0.5 font-mono text-xs text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-text-muted">{new Date(project.date).getFullYear()}</span>
        <span className="text-text-secondary transition-colors group-hover:text-accent">
          {t('view_project')} →
        </span>
      </div>
    </Link>
  );
}
