import { defineCollection, reference, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      draft: z.boolean().default(true),
      date: z.date(),
      cover: reference("photos").default("sphere-of-perfection"),
      tags: z.array(z.string()),
    }),
});

const photos = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      cover: image(),
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
      license_url: z.string(),
      attribution_name: z.string(),
      attribution_url: z.string(),
    }),
});

console.log(photos);

export const collections = {
  posts: posts,
  photos: photos,
};
