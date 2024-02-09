import type { GetStaticPaths } from "astro";
import type { ImageResponse } from "@vercel/og";
import { getOpenGraphImage, type OpenGraphImageSize } from "@/image";
import wide from "@/content/pages/images/rijksmuseum-wide.jpg";
import square from "@/content/pages/images/rijksmuseum-square.jpg";

export const getStaticPaths = (async () => {
  return [
    {
      params: { size: "wide" },
      props: { size: "wide", image: wide },
    },
    {
      params: { size: "square" },
      props: { size: "square", image: square },
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
    title: "Personal Website",
    image,
    cta: "Visit",
    description:
      "Hello! I am Tugrul Ates and I love technology, art, and everything in between. This website is my digital canvas, where I share my thoughts, creations, and experiences with the world.",
  });
};
