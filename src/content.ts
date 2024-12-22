import { type CollectionEntry, DRAFTS, getCollection } from "~/site.astro";

export async function getPages(): Promise<CollectionEntry<"pages">[]> {
  return await getCollection("pages");
}

export async function getPosts(): Promise<CollectionEntry<"posts">[]> {
  return (
    await getCollection("posts", ({ data }) => !data.draft || DRAFTS)
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getPhotos(): Promise<CollectionEntry<"photos">[]> {
  return (await getCollection("photos")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
