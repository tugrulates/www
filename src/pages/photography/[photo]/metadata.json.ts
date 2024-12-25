import type { InferGetStaticPropsType } from "astro";
import { getPhotos } from "~/content.ts";
import { getCover } from "~/image.ts";
import type { Metadata } from "~/site.astro";

export async function getStaticPaths() {
  const photos = await getPhotos();
  return photos.map((photo) => ({
    params: { photo: photo.id },
    props: { photo },
  }));
}

interface Input {
  props: InferGetStaticPropsType<typeof getStaticPaths>;
}

export async function GET({ props: { photo } }: Input): Promise<Response> {
  const cover = await getCover(photo);
  const metadata = { ...photo, cover } satisfies Metadata;
  return new Response(JSON.stringify(metadata));
}
