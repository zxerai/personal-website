import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(1).max(300),
  cover: z.string().optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  date: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString().slice(0, 10) : val),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  ),
  featured: z.boolean().default(false),
  external: z.string().url().optional(),
  order: z.number().optional(),
});

export type Project = z.infer<typeof projectSchema>;