import { type GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import { getPages, getPosts } from "@/content";
import {
  getCoverData,
  getOpenGraphImage,
  type OpenGraphImageSize,
} from "@/image";
import type { CoverType } from "@/components/Cover.astro";

export const getStaticPaths = (async () => {
  const [pages, posts] = await Promise.all([getPages(), getPosts()]);
  return (
    [...pages, ...posts].map((post) => ({
      params: { size: "wide", post: post.slug },
      props: {
        size: "wide",
        title: post.data.title,
        cover: post.data.cover,
        cta: "Read more",
        description: post.data.description,
      },
    })),
    [...pages, ...posts].map((post) => ({
      params: { size: "square", post: post.slug },
      props: {
        size: "square",
        title: post.data.title,
        cover: post.data.cover,
        cta: "Visit",
      },
    }))
  );
}) satisfies GetStaticPaths;

interface Props {
  params: { size: OpenGraphImageSize; post: string };
  props: {
    size: OpenGraphImageSize;
    title: string;
    cover: CoverType;
    cta: string;
    description?: string;
  };
}

export const GET = async ({
  props: { size, title, cover, cta, description },
}: Props): Promise<ImageResponse> => {
  const coverData = await getCoverData(cover);
  const image = size === "wide" ? coverData.data.wide : coverData.data.square;
  return await getOpenGraphImage({ size, title, image, cta, description });
};
