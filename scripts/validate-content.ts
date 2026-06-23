#!/usr/bin/env tsx
/**
 * 内容校验脚本：扫描所有 MDX 文件，验证 frontmatter 符合 Zod schema
 * 用法：npm run content:check
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { projectSchema } from '../lib/schemas/project';
import { blogSchema } from '../lib/schemas/blog';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

interface ValidationError {
  file: string;
  errors: string[];
}

const errors: ValidationError[] = [];

async function dirExists(dir: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function validateFile(
  filePath: string,
  schema: typeof projectSchema | typeof blogSchema
) {
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data } = matter(raw);

  try {
    schema.parse(data);
  } catch (err: any) {
    const fileErrors = err.errors
      ? err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`)
      : [String(err)];
    errors.push({
      file: path.relative(process.cwd(), filePath),
      errors: fileErrors,
    });
  }
}

async function validateLocale(
  locale: string,
  type: 'project' | 'blog'
): Promise<void> {
  const dir = path.join(CONTENT_ROOT, type === 'project' ? 'projects' : 'blog', locale);
  if (!(await dirExists(dir))) {
    console.warn(`⚠️  ${type}/${locale} directory does not exist`);
    return;
  }

  const files = await fs.readdir(dir);
  const mdxFiles = files.filter((f) => f.endsWith('.mdx'));

  const schema = type === 'project' ? projectSchema : blogSchema;

  await Promise.all(
    mdxFiles.map((file) =>
      validateFile(path.join(dir, file), schema)
    )
  );
}

async function main() {
  console.log('🔍 Validating content...\n');

  for (const locale of ['zh', 'en']) {
    await validateLocale(locale, 'project');
  }

  for (const locale of ['zh', 'en']) {
    await validateLocale(locale, 'blog');
  }

  for (const locale of ['zh', 'en']) {
    const resumePath = path.join(CONTENT_ROOT, 'resume', `${locale}.mdx`);
    const aboutPath = path.join(CONTENT_ROOT, 'about', `${locale}.mdx`);

    if (!(await dirExists(path.join(CONTENT_ROOT, 'resume')))) {
      errors.push({ file: 'content/resume/', errors: ['Directory does not exist'] });
    } else {
      try {
        await fs.access(resumePath);
      } catch {
        errors.push({ file: `content/resume/${locale}.mdx`, errors: ['File does not exist'] });
      }
    }

    if (!(await dirExists(path.join(CONTENT_ROOT, 'about')))) {
      errors.push({ file: 'content/about/', errors: ['Directory does not exist'] });
    } else {
      try {
        await fs.access(aboutPath);
      } catch {
        errors.push({ file: `content/about/${locale}.mdx`, errors: ['File does not exist'] });
      }
    }
  }

  if (errors.length > 0) {
    console.error('❌ Content validation failed:\n');
    for (const { file, errors: fileErrors } of errors) {
      console.error(`  ${file}:`);
      for (const err of fileErrors) {
        console.error(`    - ${err}`);
      }
    }
    console.error(`\n${errors.length} file(s) with errors.`);
    process.exit(1);
  }

  console.log('✅ All content valid.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});