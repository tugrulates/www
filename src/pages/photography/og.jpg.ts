import { getPhotos } from "@/content";
import { getOpenGraphImage } from "@/image";
import type { ImageResponse } from "@vercel/og";

export const GET = async (): Promise<ImageResponse> => {
  const photos = await getPhotos();
  return await getOpenGraphImage({
    title: "Photography",
    subtitle: "by Tugrul Ates",
    description:
      "Enjoy my photography from around the world. You are free to use all the images for any purpose. When sharing, please credit me as the photographer. Thank you! 📸",
    image: photos[0].data.wide,
    cta: "View photos",
  });
};
