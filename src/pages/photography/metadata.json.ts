import { AUTHOR } from "~/config.ts";
import { getPhotos } from "~/content.ts";
import type { Metadata } from "~/site.astro";

export async function GET(): Promise<Response> {
  const photos = await getPhotos();
  const metadata = {
    data: {
      title: "Photography",
      subtitle: `by ${AUTHOR.name}`,
      description: `Enjoy my photography from around the world.
                    You are free to use all the images for any purpose.
                    When sharing, please credit me as the photographer.
                    Thank you! 📸`,
    },
    cover: photos[0],
  } satisfies Metadata;
  return new Response(JSON.stringify(metadata));
}
