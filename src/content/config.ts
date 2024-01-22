import { defineCollection, reference, z } from "astro:content";

const pages = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      tab: z.string(),
      title: z.string(),
      date: z.date().optional(),
      cover: reference("photos").or(
        z.object({
          rectangle: image(),
          square: image(),
          description: z.string(),
        }),
      ),
    }),
});

const posts = defineCollection({
  type: "content",
  schema: z.object({
    tab: z.string().default("blog"),
    title: z.string(),
    draft: z.boolean().default(true),
    date: z.date(),
    cover: reference("photos"),
    tags: z.array(z.string()),
  }),
});

const photos = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      rectangle: image(),
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
      license_name: z.string(),
      license_url: z.string().url(),
      attribution_name: z.string(),
      attribution_url: z.string().url(),
    }),
});

export const collections = {
  pages,
  posts,
  photos,
};
