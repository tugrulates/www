import { type GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import { getPages, getPosts } from "@/content";
import { getOpenGraphImage, getCoverData } from "@/image";
import type { CoverType } from "@/components/Cover.astro";

export const getStaticPaths = (async () => {
  const pages = await getPages();
  const posts = await getPosts();
  return [
    ...pages.map((page) => ({
      params: { post: page.slug },
      props: {
        title: page.data.title,
        description: page.data.description,
        cover: page.data.cover,
        cta: "Read more",
      },
    })),
    ...posts.map((post) => ({
      params: { post: post.slug },
      props: {
        title: post.data.title,
        description: post.data.description,
        cover: post.data.cover,
        cta: "Read more",
      },
    })),
  ];
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
  props: { title, description, cover, cta },
}: Props): Promise<ImageResponse> => {
  const coverData = await getCoverData(cover);
  const image: ImageMetadata = coverData.data.wide;
  return await getOpenGraphImage(title, description, image, cta);
};
