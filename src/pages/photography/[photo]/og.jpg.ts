import type { InferGetStaticPropsType } from "astro";
import { SITE } from "~/config.ts";
import { getPhotos } from "~/content.ts";
import { formatDate } from "~/date.ts";
import { getOpenGraphImage } from "~/image.ts";

export async function getStaticPaths() {
  const photos = await getPhotos();
  return photos.map((photo) => ({
    params: { photo: photo.id },
    props: {
      url: SITE.url,
      title: photo.data.title,
      description: `${formatDate(photo.data.date)} — ${photo.data.location}`,
      image: photo.data.wide,
      cta: "View photo",
    },
  }));
}

interface Input {
  props: InferGetStaticPropsType<typeof getStaticPaths>;
}

export async function GET({ props }: Input): Promise<Response> {
  return await getOpenGraphImage(props);
}
