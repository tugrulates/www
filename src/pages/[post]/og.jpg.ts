import { type GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import { getPages, getPosts } from "@/content";
import { getCoverData, getOpenGraphImage } from "@/image";
import type { CoverType } from "@/components/Cover.astro";

export const getStaticPaths = (async () => {
  const [pages, posts] = await Promise.all([getPages(), getPosts()]);
  return [...pages, ...posts].map((post) => ({
    params: { post: post.slug },
    props: {
      title: post.data.title,
      cover: post.data.cover,
      cta: "Read more",
      description: post.data.description,
    },
  }));
}) satisfies GetStaticPaths;

interface Props {
  params: { post: string };
  props: {
    title: string;
    description: string;
    cover: CoverType;
    cta: string;
  };
}

export const GET = async ({
  props: { title, cover, cta, description },
}: Props): Promise<ImageResponse> => {
  const coverData = await getCoverData(cover);
  const image = coverData.data.square;
  return await getOpenGraphImage({ title, description, image, cta });
};
