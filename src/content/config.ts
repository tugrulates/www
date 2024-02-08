import { defineCollection, reference, z } from "astro:content";

const pages = defineCollection({
  type: "content",
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

const posts = defineCollection({
  type: "content",
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

const photos = defineCollection({
  type: "data",
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
