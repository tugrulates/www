import type { GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import { getOpenGraphImage, type OpenGraphImageSize } from "@/image";
import { getPhotos } from "@/content";

export const getStaticPaths = (async () => {
  const photos = await getPhotos();
  return [
    {
      params: { size: "wide" },
      props: { size: "wide", image: photos[0].data.wide },
    },
    {
      params: { size: "square" },
      props: { size: "square", image: photos[0].data.square },
    },
  ];
}) satisfies GetStaticPaths;

interface Props {
  params: { size: OpenGraphImageSize };
  props: {
    size: OpenGraphImageSize;
    image: ImageMetadata;
  };
}

export const GET = async ({
  props: { size, image },
}: Props): Promise<ImageResponse> => {
  return await getOpenGraphImage({
    size,
    title: "Photography by Tugrul Ates",
    image,
    cta: "View photos",
    description:
      "Enjoy my photography from around the world. You are free to use all the images for any purpose. When sharing, please credit me as the photographer. Thank you! 📸",
  });
};
