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
      image: image(),
      title: z.string(),
      description: z.string(),
      date: z.string().transform((value) => new Date(value)),
    }),
});

console.log(photos);

export const collections = {
  posts: posts,
  photos: photos,
};
