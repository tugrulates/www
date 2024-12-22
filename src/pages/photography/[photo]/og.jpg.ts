import type { ImageResponse } from "@vercel/og";
import type { GetStaticPaths } from "astro";
import { getPhotos } from "~/content.ts";
import { formatDate } from "~/date.ts";
import { getOpenGraphImage, type OpenGraphImageData } from "~/image.ts";

export const getStaticPaths = (async () => {
  const photos = await getPhotos();
  return photos.map((photo) => ({
    params: { photo: photo.id },
    props: {
      title: photo.data.title,
      description: `${formatDate(photo.data.date)} — ${photo.data.location}`,
      image: photo.data.wide,
      cta: "View photo",
    },
  }));
}) satisfies GetStaticPaths;

interface Props {
  params: { photo: string };
  props: OpenGraphImageData;
}

export const GET = async (props: Props): Promise<ImageResponse> => {
  return await getOpenGraphImage(props.props);
};
