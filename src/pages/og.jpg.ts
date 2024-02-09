import type { ImageResponse } from "@vercel/og";
import { getOpenGraphImage } from "@/image";
import image from "@/content/pages/images/rijksmuseum-square.jpg";

export const GET = async (): Promise<ImageResponse> => {
  return await getOpenGraphImage({
    title: "Personal Website",
    description:
      "Hello! I am Tugrul Ates and I love technology, art, and everything in between. This website is my digital canvas, where I share my thoughts, creations, and experiences with the world.",
    image,
    cta: "Visit",
  });
};
