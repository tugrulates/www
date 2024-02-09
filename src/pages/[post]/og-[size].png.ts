import { type GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import { getCovers, getPages, getPosts } from "@/content";
import { getOpenGraphImage, type OpenGraphImageSize } from "@/image";

export const getStaticPaths = (async () => {
  const pages = await getPages();
  const posts = await getPosts();
  const covers = await getCovers();
  return [
    ...pages.map((page) => ({
      params: { size: "wide", post: page.slug },
      props: {
        size: "wide",
        title: page.data.title,
        image: covers.get(page.id.toString())?.data.wide,
        cta: "Read more",
        description: page.data.description,
      },
    })),
    ...pages.map((page) => ({
      params: { size: "square", post: page.slug },
      props: {
        size: "square",
        title: page.data.title,
        image: covers.get(page.id.toString())?.data.square,
        cta: "Visit",
      },
    })),
    ...posts.map((post) => ({
      params: { size: "wide", post: post.slug },
      props: {
        size: "wide",
        title: post.data.title,
        image: covers.get(post.id.toString())?.data.wide,
        cta: "Read more",
        description: post.data.description,
      },
    })),
    ...posts.map((post) => ({
      params: { size: "square", post: post.slug },
      props: {
        size: "square",
        title: post.data.title,
        image: covers.get(post.id.toString())?.data.square,
        cta: "Read post",
      },
    })),
  ];
}) satisfies GetStaticPaths;

interface Props {
  params: { post: string };
  props: {
    size: OpenGraphImageSize;
    title: string;
    image: ImageMetadata;
    cta: string;
    description?: string;
  };
}

export const GET = async ({
  props: { size, title, image, cta, description },
}: Props): Promise<ImageResponse> => {
  return await getOpenGraphImage({ size, title, image, cta, description });
};
