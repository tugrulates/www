import { APIRoute } from "astro";
import { AUTHOR } from "~/config.ts";
import { getPhotos } from "~/content.ts";
import { getOpenGraphImage } from "~/node.ts";

export const prerender = false;

export const GET: APIRoute = async () => {
  const photos = await getPhotos();
  return await getOpenGraphImage(
    {
      image: photos[0].data.wide,
      title: "Photography",
      subtitle: `by ${AUTHOR.name}`,
      description: `Enjoy my photography from around the world.
                    You are free to use these for any purpose.
                    When sharing, credit me as the photographer.`,
      cta: "Visit",
    },
  );
};
