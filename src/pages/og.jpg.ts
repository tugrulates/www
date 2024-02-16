import type { ImageResponse } from "@vercel/og";
import image from "~/content/pages/images/rijksmuseum-wide.jpg";
import { getOpenGraphImage } from "~/image";

export const GET = async (): Promise<ImageResponse> => {
  return await getOpenGraphImage({
    title: "Tugrul Ates",
    subtitle: "Personal Website",
    description:
      "Hello! I am Tugrul Ates and I love technology, art, and everything in between. This website is my digital canvas, where I share my thoughts, creations, and experiences with the world.",
    image,
    cta: "Visit",
  });
};
