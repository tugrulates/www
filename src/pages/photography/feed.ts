import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { AUTHOR } from "~/config.ts";
import { getPhotos } from "~/content.ts";

export async function GET({ url }: APIContext): Promise<Response> {
  const photos = await getPhotos();
  return await rss({
    title: "Tugrul Ates — Photography",
    description: "Photography by Tugrul Ates",
    site: url.origin,
    trailingSlash: false,
    items: photos.map((photo) => ({
      link: photo.id,
      title: photo.data.title,
      pubDate: photo.data.date,
      description: photo.data.description,
      categories: photo.data.keywords,
      author: AUTHOR.name,
    })),
  });
}
