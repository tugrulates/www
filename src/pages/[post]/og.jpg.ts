import type { APIContext } from "astro";
import { getCover, getOpenGraphImage } from "~/image.ts";
import { getEntry, NOT_FOUND } from "~/site.astro";

export async function GET({ url, params }: APIContext) {
  const post = await getEntry("posts", params.post ?? "") ??
    await getEntry("pages", params.post ?? "");
  if (!post) return NOT_FOUND;
  const cover = await getCover(post.data.cover);
  return await getOpenGraphImage({
    site: new URL(url.origin),
    image: cover.data.wide,
    title: post.data.title,
    cta: "Read more",
    description: post.data.description,
  });
}
