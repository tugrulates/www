import { AUTHOR, SITE } from "@/config";
import { getPhotos } from "@/content";
import rss from "@astrojs/rss";

export async function GET(): Promise<Response> {
  const photos = await getPhotos();
  return await rss({
    title: "Tugrul Ates — Photography",
    description: "Photography by Tugrul Ates",
    site: SITE.url,
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
