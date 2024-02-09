import type { ImageResponse } from "@vercel/og";
import { getOpenGraphImage } from "@/image";
import { getPhotos } from "@/content";

export const GET = async (): Promise<ImageResponse> => {
  const photos = await getPhotos();
  return await getOpenGraphImage({
    title: "Photography by Tugrul Ates",
    description:
      "Enjoy my photography from around the world. You are free to use all the images for any purpose. When sharing, please credit me as the photographer. Thank you! 📸",
    image: photos[0].data.square,
    cta: "View photos",
  });
};
