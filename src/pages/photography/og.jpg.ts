import { getPhotos } from "~/content.ts";
import { getOpenGraphImage } from "~/image.ts";

export async function GET(): Promise<Response> {
  const photos = await getPhotos();
  return await getOpenGraphImage({
    title: "Photography",
    description: `
      Enjoy my photography from around the world. You are free to use
      all the images for any purpose. When sharing, please credit me
      as the photographer. Thank you! 📸`,
    image: photos[0].data.wide,
    cta: "View photos",
  });
}
