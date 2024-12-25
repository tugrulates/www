import rss from "@astrojs/rss";
import { APIContext } from "astro";
import { AUTHOR } from "~/config.ts";
import { getPosts } from "~/content.ts";

export async function GET({ url }: APIContext): Promise<Response> {
  const posts = await getPosts();
  return await rss({
    title: "Tugrul Ates — Posts",
    description: "Posts by Tugrul Ates",
    site: url.origin,
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
