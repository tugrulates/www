import type { APIContext } from "astro";
import { getCover, getOpenGraphImage } from "~/image.ts";
import { getEntry } from "~/site.astro";

export const prerender = false;

export async function GET({ params }: APIContext) {
  const post = await getEntry("posts", params.post ?? "") ??
    await getEntry("pages", params.post ?? "");
  if (!post) return new Response("Not found", { status: 404 });
  const cover = await getCover(post.data.cover);
  return await getOpenGraphImage({
    image: cover.data.wide,
    title: post.data.title,
    cta: "Read more",
    description: post.data.description,
  });
}
