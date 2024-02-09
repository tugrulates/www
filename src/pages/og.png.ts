import type { ImageResponse } from "@vercel/og";
import { getOpenGraphImage } from "@/image";
import cover from "@/content/pages/images/rijksmuseum-wide.jpg";

export const GET = async (): Promise<ImageResponse> => {
  return await getOpenGraphImage(
    "Personal Website",
    "Hello! I am Tugrul Ates and I love technology, art, and everything in between. This website is my digital canvas, where I share my thoughts, creations, and experiences with the world.",
    cover,
    "Visit",
  );
};
