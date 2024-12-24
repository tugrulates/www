import type { GetStaticPaths } from "astro";
import { getPhotos } from "~/content.ts";
import { getCover } from "~/image.ts";
import type { CollectionEntry, Metadata } from "~/site.astro";

export const getStaticPaths = (async () => {
  const photos = await getPhotos();
  return photos.map((photo) => ({
    params: { photo: photo.id },
    props: { photo },
  }));
}) satisfies GetStaticPaths;

interface Props {
  params: { photo: string };
  props: { photo: CollectionEntry<"photos"> };
}

export async function GET({ props: { photo } }: Props): Promise<Response> {
  const cover = await getCover(photo);
  const metadata = { ...photo, cover } satisfies Metadata;
  return new Response(JSON.stringify(metadata, null, 2), {
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  });
}
