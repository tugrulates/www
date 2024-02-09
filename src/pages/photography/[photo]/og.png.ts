import { type GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import { getPhotos } from "@/content";
import { getOpenGraphImage, getCoverData } from "@/image";
import type { CoverType } from "@/components/Cover.astro";
import { formatDate } from "@/date";

export const getStaticPaths = (async () => {
  const photos = await getPhotos();
  return photos.map((photo) => ({
    params: { photo: photo.id },
    props: {
      title: photo.data.title,
      description: `${formatDate(photo.data.date)} — ${photo.data.location}`,
      cover: photo,
      cta: "View photo",
    },
  }));
}) satisfies GetStaticPaths;

interface Props {
  params: { photo: string };
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
  return await getOpenGraphImage(
    title,
    description,
    coverData.data.wide as ImageMetadata,
    cta,
  );
};
