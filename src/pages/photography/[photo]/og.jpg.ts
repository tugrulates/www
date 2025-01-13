import { InferGetStaticPropsType } from "astro";
import { SITE } from "~/config.ts";
import { getPhotos } from "~/content.ts";
import { formatDate } from "~/date.ts";
import { getOpenGraphImage } from "~/image.ts";

export async function getStaticPaths() {
  const photos = await getPhotos();
  return photos.map((photo) => ({
    params: { photo: photo.id },
    props: { photo },
  }));
}

interface Context {
  props: InferGetStaticPropsType<typeof getStaticPaths>;
}

export async function GET({ props }: Context) {
  return await getOpenGraphImage(
    {
      site: SITE.url,
      image: props.photo.data.wide,
      title: props.photo.data.title,
      description: `${
        formatDate(props.photo.data.date)
      } — ${props.photo.data.location}`,
      cta: "View photo",
    },
  );
}
