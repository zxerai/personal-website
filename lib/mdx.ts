import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { projectSchema, type Project } from './schemas/project';
import { blogSchema, type BlogPost } from './schemas/blog';
import { siteConfig, type Locale } from './utils';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

const projectsDir = (locale: string) =>
  path.join(CONTENT_ROOT, 'projects', locale);

const blogDir = (locale: string) => path.join(CONTENT_ROOT, 'blog', locale);

const resumeFile = (locale: string) => path.join(CONTENT_ROOT, 'resume', `${locale}.mdx`);

const aboutFile = (locale: string) => path.join(CONTENT_ROOT, 'about', `${locale}.mdx`);

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function dirExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function readMDXDir(
  dir: string
): Promise<Array<{ slug: string; frontmatter: any; content: string }>> {
  if (!(await dirExists(dir))) return [];

  const files = await fs.readdir(dir);
  const mdxFiles = files.filter((f) => f.endsWith('.mdx'));

  return Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(dir, file);
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);
      return { slug, frontmatter: data, content };
    })
  );
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const dir = projectsDir(locale);
  const entries = await readMDXDir(dir);

  const projects = entries
    .map((entry) => {
      try {
        return projectSchema.parse(entry.frontmatter);
      } catch (err) {
        console.error(`Invalid project frontmatter in ${dir}/${entry.slug}.mdx:`, err);
        return null;
      }
    })
    .filter((p): p is Project => p !== null);

  return projects.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return b.date.localeCompare(a.date);
  });
}

export async function getProject(
  slug: string,
  locale: Locale
): Promise<{ frontmatter: Project; content: string; availableLocales: Locale[] } | null> {
  const availableLocales: Locale[] = [];
  for (const loc of siteConfig.supportedLocales) {
    const filePath = path.join(projectsDir(loc), `${slug}.mdx`);
    if (await fileExists(filePath)) {
      availableLocales.push(loc);
    }
  }

  if (availableLocales.length === 0) return null;

  const targetLocale = availableLocales.includes(locale)
    ? locale
    : siteConfig.defaultLocale;

  const filePath = path.join(projectsDir(targetLocale), `${slug}.mdx`);
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = projectSchema.parse(data);

  return { frontmatter, content, availableLocales };
}

export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const dir = blogDir(locale);
  const entries = await readMDXDir(dir);

  const posts = entries
    .map((entry) => {
      try {
        const parsed = blogSchema.parse(entry.frontmatter);
        return parsed.draft ? null : parsed;
      } catch (err) {
        console.error(`Invalid blog frontmatter in ${dir}/${entry.slug}.mdx:`, err);
        return null;
      }
    })
    .filter((p): p is BlogPost => p !== null);

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlogPost(
  slug: string,
  locale: Locale
): Promise<{ frontmatter: BlogPost; content: string; availableLocales: Locale[] } | null> {
  const availableLocales: Locale[] = [];
  for (const loc of siteConfig.supportedLocales) {
    const filePath = path.join(blogDir(loc), `${slug}.mdx`);
    if (await fileExists(filePath)) {
      availableLocales.push(loc);
    }
  }

  if (availableLocales.length === 0) return null;

  const targetLocale = availableLocales.includes(locale)
    ? locale
    : siteConfig.defaultLocale;

  const filePath = path.join(blogDir(targetLocale), `${slug}.mdx`);
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = blogSchema.parse(data);

  return { frontmatter, content, availableLocales };
}

export async function getResume(
  locale: Locale
): Promise<{ content: string; availableLocales: Locale[] } | null> {
  const availableLocales: Locale[] = [];
  for (const loc of siteConfig.supportedLocales) {
    if (await fileExists(resumeFile(loc))) {
      availableLocales.push(loc);
    }
  }

  if (availableLocales.length === 0) return null;

  const targetLocale = availableLocales.includes(locale)
    ? locale
    : siteConfig.defaultLocale;

  const content = await fs.readFile(resumeFile(targetLocale), 'utf-8');
  return { content, availableLocales };
}

export async function getAbout(
  locale: Locale
): Promise<{ content: string; availableLocales: Locale[] } | null> {
  const availableLocales: Locale[] = [];
  for (const loc of siteConfig.supportedLocales) {
    if (await fileExists(aboutFile(loc))) {
      availableLocales.push(loc);
    }
  }

  if (availableLocales.length === 0) return null;

  const targetLocale = availableLocales.includes(locale)
    ? locale
    : siteConfig.defaultLocale;

  const content = await fs.readFile(aboutFile(targetLocale), 'utf-8');
  return { content, availableLocales };
}