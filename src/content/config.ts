import { z, defineCollection } from "astro:content";

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        draft: z.boolean().default(true),
        date: z.date(),
        cover: image().refine((img) => img.width >= 1080, {
          message: "Cover image must be at least 1080 pixels wide!",
        }),
        tags: z.array(z.string()),
      }),
  }),
};
