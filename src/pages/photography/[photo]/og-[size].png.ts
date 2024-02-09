import { type GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import { getPhotos } from "@/content";
import {
  getOpenGraphImage,
  type OpenGraphImageData,
  type OpenGraphImageSize,
} from "@/image";
import { formatDate } from "@/date";

export const getStaticPaths = (async () => {
  const photos = await getPhotos();
  return [
    ...photos.map((photo) => ({
      params: { size: "wide", photo: photo.id },
      props: {
        title: photo.data.title,
        size: "wide",
        image: photo.data.wide,
        cta: "View photo",
        description: `${formatDate(photo.data.date)} — ${photo.data.location}`,
      },
    })),
    ...photos.map((photo) => ({
      params: { size: "square", photo: photo.id },
      props: {
        size: "square",
        title: photo.data.title,
        image: photo.data.square,
        cta: "View photo",
      },
    })),
  ];
}) satisfies GetStaticPaths;

interface Props {
  params: { size: OpenGraphImageSize; photo: string };
  props: OpenGraphImageData;
}

export const GET = async (props: Props): Promise<ImageResponse> => {
  return await getOpenGraphImage(props.props);
};
