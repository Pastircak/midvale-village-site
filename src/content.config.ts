import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const officials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/officials' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    role: z.enum(['mayor', 'council', 'fiscal-officer', 'public-affairs', 'police', 'streets', 'other']),
    order: z.number().default(99),
    verified: z.boolean().default(false),
    verifiedDate: z.coerce.date().nullable().optional(),
    notes: z.string().optional(),
    photo: z.string().nullable().optional(),
    contactEmail: z.string().email().nullable().optional(),
    term: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Village of Midvale'),
    excerpt: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const alerts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/alerts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    severity: z.enum(['emergency', 'advisory', 'info']).default('info'),
    summary: z.string().optional(),
    status: z.enum(['active', 'resolved', 'scheduled']).default('active'),
    expiresAt: z.coerce.date().nullable().optional(),
  }),
});

const meetings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/meetings' }),
  schema: z.object({
    body: z.enum(['council', 'public-affairs', 'mayors-court', 'special']),
    date: z.coerce.date(),
    time: z.string().optional(),
    location: z.string().default('Village Hall, 3111 Barnhill Road'),
    note: z.string().optional(),
    agendaUrl: z.string().optional(),
    minutesUrl: z.string().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    icon: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { officials, news, alerts, meetings, services };
