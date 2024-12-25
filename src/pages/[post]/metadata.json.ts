import type { InferGetStaticPropsType } from "astro";
import { getPages, getPosts } from "~/content.ts";
import { getCover } from "~/image.ts";
import type { Metadata } from "~/site.astro";

export async function getStaticPaths() {
  const [pages, posts] = await Promise.all([getPages(), getPosts()]);
  return [...pages, ...posts].map((post) => ({
    params: { post: post.id.replace(/^posts\//, "") },
    props: { post },
  }));
}

interface Input {
  props: InferGetStaticPropsType<typeof getStaticPaths>;
}

export async function GET({ props: { post } }: Input): Promise<Response> {
  const cover = await getCover(post.data.cover);
  const metadata = { ...post, cover } satisfies Metadata;
  return new Response(JSON.stringify(metadata));
}
