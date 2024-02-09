import { getCollection, type CollectionEntry } from "astro:content";
import type { CoverMeta, CoverType } from "@/components/Cover.astro";
import { getCoverData } from "@/image";

export async function getPages(): Promise<Array<CollectionEntry<"pages">>> {
  return await getCollection("pages");
}

export async function getPosts(): Promise<Array<CollectionEntry<"posts">>> {
  return (
    await getCollection("posts", ({ data }) => {
      return !data.draft || import.meta.env.DRAFTS;
    })
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getCovers(): Promise<Map<string, CoverMeta>> {
  const [pages, posts] = await Promise.all([getPages(), getPosts()]);
  const covers = await Promise.all(
    [...pages, ...posts].map(
      async (page) =>
        await Promise.all([
          page.id.toString(),
          getCoverData(page.data.cover as CoverType),
        ]),
    ),
  );
  return new Map<string, CoverMeta>(covers);
}

export async function getPhotos(): Promise<Array<CollectionEntry<"photos">>> {
  return (await getCollection("photos")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
