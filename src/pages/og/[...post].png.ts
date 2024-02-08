import { type GetStaticPaths, type APIRoute } from "astro";
import "@fontsource/fira-sans";
import { getPages, getPosts } from "@/content";
import { getOpenGraphImage, getPageCover } from "@/image";
import type { ImageResponse } from "@vercel/og";

export const getStaticPaths = (async () => {
  const pages = await getPages();
  const posts = await getPosts();
  return [
    ...pages.map((page) => ({
      params: { post: page.slug },
      props: { page },
    })),
    ...posts.map((page) => ({
      params: { post: page.slug },
      props: { page },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute<ImageResponse> = async ({
  props,
}): Promise<ImageResponse> => {
  const cover = await getPageCover(props.page);
  return await getOpenGraphImage(cover.data.wide);
};
