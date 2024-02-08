import { type GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import "@fontsource/fira-sans";
import { getPages, getPosts, getPhotos } from "@/content";
import { getOpenGraphImage, getCoverData } from "@/image";
import type { CoverType } from "@/components/Cover.astro";

export const getStaticPaths = (async () => {
  const pages = await getPages();
  const posts = await getPosts();
  const photos = await getPhotos();
  return [
    ...pages.map((page) => ({
      params: { path: page.slug },
      props: {
        title: page.data.title,
        description: page.data.description,
        cover: page.data.cover,
        cta: "Read more",
      },
    })),
    ...posts.map((post) => ({
      params: { path: post.slug },
      props: {
        title: post.data.title,
        description: post.data.description,
        cover: post.data.cover,
        cta: "Read more",
      },
    })),
    ...photos.map((photo) => ({
      params: { path: `photography/${photo.id}` },
      props: {
        title: photo.data.title,
        description: photo.data.description,
        cover: photo,
        cta: "View photo",
      },
    })),
  ];
}) satisfies GetStaticPaths;

interface Props {
  params: { slug: string };
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
