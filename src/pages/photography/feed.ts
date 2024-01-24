import rss from "@astrojs/rss";
import { AUTHOR, SITE } from "@/consts";
import { getPhotos } from "@/content";

export async function GET(): Promise<Response> {
  const photos = await getPhotos();
  return await rss({
    title: "Tugrul Ates — Photography",
    description: "Photography by Tugrul Ates",
    site: SITE.url,
    items: photos.map((photo) => ({
      link: `photography/${photo.id}`,
      title: photo.data.title,
      pubDate: photo.data.date,
      description: photo.data.description,
      categories: photo.data.keywords,
      author: AUTHOR.name,
    })),
  });
}
