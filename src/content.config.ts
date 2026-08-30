import { defineCollection, z } from "astro:content";

const books = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    cover: z.string(),
    publicationStatus: z.string().optional(),
    publicationDate: z.coerce.date().optional(),
    links: z
      .object({
        label: z.string(),
        url: z.string().url(),
      })
      .array()
      .optional(),
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
    links: z
      .object({
        label: z.string(),
        url: z.string().url(),
      })
      .array()
      .optional(),
    heroImage: z.string().optional(),
  }),
});

const travelTrips = defineCollection({
  type: "data",
  schema: z.object({
    country: z.string(),
    continent: z.string(),
    places: z.string().array().default([]),
    tripStart: z.coerce.date().optional(),
    tripEnd: z.coerce.date().optional(),
    purpose: z.string().optional(),
    flights: z
      .object({
        date: z.coerce.date().optional(),
        from: z.string(),
        to: z.string(),
        airline: z.string().optional(),
        flightNumber: z.string().optional(),
        seat: z.string().optional(),
      })
      .array()
      .default([]),
    accommodation: z
      .object({
        place: z.string(),
        name: z.string().optional(),
        dates: z.string().optional(),
        notes: z.string().optional(),
      })
      .array()
      .default([]),
    transport: z.string().array().default([]),
    rides: z.string().array().default([]),
    photography: z
      .object({
        label: z.string(),
        url: z.string().url(),
      })
      .array()
      .optional(),
    stories: z.string().array().default([]),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
  }),
});

const travelStories = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    country: z.string(),
    continent: z.string(),
    trip: z.string().optional(),
    date: z.coerce.date().optional(),
    description: z.string(),
    heroImage: z.string().optional(),
    photography: z
      .object({
        label: z.string(),
        url: z.string().url(),
      })
      .array()
      .optional(),
    relatedRides: z.string().array().optional(),
    relatedWriting: z.string().array().optional(),
  }),
});

export const collections = {
  books,
  writing,
  projects,
  travelTrips,
  travelStories,
};
