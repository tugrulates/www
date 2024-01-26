import { getCollection, type CollectionEntry } from "astro:content";

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

export async function getPhotos(): Promise<Array<CollectionEntry<"photos">>> {
  return (await getCollection("photos")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
