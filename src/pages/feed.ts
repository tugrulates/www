import rss from "@astrojs/rss";
import { AUTHOR, SITE } from "~/config.ts";
import { getPosts } from "~/content.astro";

export async function GET(): Promise<Response> {
  const posts = await getPosts();
  return await rss({
    title: "Tugrul Ates — Posts",
    description: "Posts by Tugrul Ates",
    site: SITE.url,
    trailingSlash: false,
    items: posts.map((post) => ({
      link: post.id,
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      categories: post.data.tags,
      author: AUTHOR.name,
    })),
  });
}
