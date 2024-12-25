import type { APIRoute } from "astro";
import { getCover } from "~/image.ts";
import { getOpenGraphImage } from "~/node.ts";
import { getEntry } from "~/site.astro";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const post = await getEntry("posts", params.post ?? "");
  if (!post) return new Response("Not found", { status: 404 });
  const cover = await getCover(post.data.cover);
  return await getOpenGraphImage({
    title: post.data.title,
    cta: "Read more",
    description: post.data.description,
    image: cover.data.wide,
  });
};
