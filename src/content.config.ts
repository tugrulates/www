import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

/**
 * Pages collection.
 *
 * Pages are static, and part of the www repo.
 */
const pages = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/pages",
  }),
  schema: ({ image }) =>
    z.object({
      tab: z.string(),
      title: z.string(),
      description: z.string(),
      date: z.date().optional(),
      cover: reference("photos").or(
        z.object({
          wide: image(),
          square: image(),
          description: z.string(),
        }),
      ),
      tags: z.array(z.string()).optional(),
    }),
});

/**
 * Posts collection.
 *
 * Posts are fetched from the submodule to the blog repo.
 *
 * @todo `generateId` is not working as expected.
 */
const posts = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/blog/posts",
    generateId: ({ entry }) =>
      entry.replace(/^posts\//, "").replace(/\.[^.]+$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      tab: z.string().default("posts"),
      title: z.string(),
      description: z.string(),
      draft: z.boolean().default(true),
      date: z.date(),
      cover: reference("photos").or(
        z.object({
          wide: image(),
          square: image(),
          description: z.string(),
        }),
      ),
      tags: z.array(z.string()),
    }),
});

/**
 * Photos collection.
 *
 * Photos are fetched from the submodule to the photos repo. Their metadata is
 * extracted into JSON files, which are the actual collection.
 */
const photos = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/photos" }),
  schema: ({ image }) =>
    z.object({
      wide: image(),
      square: image(),
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
      date: z.string().transform((value) => new Date(value)),
      location: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      camera: z.string(),
      lens: z.string(),
      editing: z.string(),
      license: z.string().url(),
    }),
});

export const collections = {
  pages,
  posts,
  photos,
};
