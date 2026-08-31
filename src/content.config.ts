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

const writing = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date().optional(),
    type: z.string().optional(),
    tags: z.string().array().optional(),
    heroImage: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: "content",
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
    banner: z.string().optional(),
    photography: z.any().optional(),
    metadata: z.any().optional(),
    visits: travelVisit.array().default([]),
  }).passthrough(),
});

export const collections = { books, writing, projects, travel };
