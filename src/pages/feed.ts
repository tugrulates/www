import rss from "@astrojs/rss";
import { AUTHOR, SITE } from "~/config";
import { getPosts } from "~/content";

export async function GET(): Promise<Response> {
  const posts = await getPosts();
  return await rss({
    title: "Tugrul Ates — Posts",
    description: "Posts by Tugrul Ates",
    site: SITE.url,
    trailingSlash: false,
    items: posts.map((post) => ({
      link: post.slug,
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      categories: post.data.tags,
      author: AUTHOR.name,
    })),
  });
}
