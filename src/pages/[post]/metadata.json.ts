import type { GetStaticPaths } from "astro";
import { getPages, getPosts } from "~/content.ts";
import { getCover } from "~/image.ts";
import type { CollectionEntry, Metadata } from "~/site.astro";

export const getStaticPaths = (async () => {
  const [pages, posts] = await Promise.all([getPages(), getPosts()]);
  return [...pages, ...posts].map((post) => ({
    params: { post: post.id.replace(/^posts\//, "") },
    props: { post },
  }));
}) satisfies GetStaticPaths;

interface Props {
  params: { post: string };
  props: { post: CollectionEntry<"posts"> | CollectionEntry<"pages"> };
}

export async function GET({ props: { post } }: Props): Promise<Response> {
  const cover = await getCover(post.data.cover);
  const metadata = { ...post, cover } satisfies Metadata;
  return new Response(JSON.stringify(metadata, null, 2), {
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  });
}
