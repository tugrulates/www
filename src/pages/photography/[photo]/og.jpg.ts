import { type GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import { getPhotos } from "@/content";
import { getOpenGraphImage, type OpenGraphImageData } from "@/image";
import { formatDate } from "@/date";

export const getStaticPaths = (async () => {
  const photos = await getPhotos();
  return photos.map((photo) => ({
    params: { sphoto: photo.id },
    props: {
      title: photo.data.title,
      description: `${formatDate(photo.data.date)} — ${photo.data.location}`,
      image: photo.data.square,
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
