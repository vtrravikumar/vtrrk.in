import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const books = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    cover: z.string(),
    publicationStatus: z.string().optional(),
    publicationDate: z.coerce.date().optional(),
    links: z.object({ label: z.string(), url: z.string().url() }).array().optional(),
  }),
});

const writingFields = {
  title: z.string(),
  description: z.string(),
  subtitle: z.string().optional(),
  date: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.string().optional(),
  tags: z.string().array().default([]),
  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
  shareText: z.string().optional(),
  glossaryTerms: z.string().array().default([]),
  sortOrder: z.number().optional(),
  draft: z.boolean().default(false),
};

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object(writingFields),
});

const writingDrafts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./.local/writing-drafts" }),
  schema: z.object({
    ...writingFields,
    candidateGlossaryTerms: z.string().array().default([]),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/glossary" }),
  schema: z.object({
    term: z.string(),
    definition: z.string(),
    aliases: z.string().array().default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    purpose: z.string().optional(),
    status: z.enum(["Active", "Exploring", "Paused", "Completed", "Archived"]).optional(),
    links: z.object({ label: z.string(), url: z.string().url() }).array().optional(),
    heroImage: z.string().optional(),
  }),
});

const travelVisit = z.object({
  title: z.string().nullable().optional(),
  from: z.coerce.date().nullable().optional(),
  to: z.coerce.date().nullable().optional(),
  duration_days: z.number().nullable().optional(),
  travelled_with: z.string().array().optional(),
  travel_type: z.string().nullable().optional(),
  solo: z.boolean().optional(),
  origin: z.string().nullable().optional(),
  route: z.string().array().optional(),
  places_visited: z.string().array().optional(),
  highlights: z.string().array().optional(),
  flights: z.any().optional(),
  accommodation: z.any().optional(),
  transport: z.string().array().optional(),
  stays: z.any().optional(),
  occasion: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
}).passthrough();

const travel = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/travel" }),
  schema: z.object({
    title: z.string(),
    country: z.string(),
    region: z.string().nullable().optional(),
    continent: z.string().nullable().optional(),
    status: z.string().optional(),
    content_status: z.enum(["published", "draft"]).default("draft"),
    banner: z.string().default("/images/travel/default.jpg"),
    photography: z.any().optional(),
    metadata: z.any().optional(),
    visits: travelVisit.array().default([]),
  }).passthrough(),
});

export const collections = { books, writing, writingDrafts, glossary, projects, travel };
