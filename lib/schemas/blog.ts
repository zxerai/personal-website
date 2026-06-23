import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(1).max(500),
  date: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString().slice(0, 10) : val),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  ),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type BlogPost = z.infer<typeof blogSchema>;