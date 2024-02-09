import type { ImageResponse } from "@vercel/og";
import { getOpenGraphImage } from "@/image";
import { getPhotos } from "@/content";

export const GET = async (): Promise<ImageResponse> => {
  const photos = await getPhotos();
  return await getOpenGraphImage(
    "Photography by Tugrul Ates",
    "I enjoy playing around with light and images. It's just a hobby, but it brings me happiness, especially when I capture unique moments and artifacts.",
    photos[0].data.wide,
    "Visit",
  );
};
