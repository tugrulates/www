import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { getEntry } from "~/site.astro";

export async function getCover(cover: CoverType): Promise<CoverMeta> {
  if ("collection" in cover && cover.collection === "photos") {
    const entry = await getEntry("photos", cover.id);
    if (!entry) throw new Error(`Photo not found: ${cover.id}`);
    return entry;
  }
  if ("wide" in cover) {
    return {
      id: undefined,
      data: cover,
    };
  }
  throw new Error(`Invalid cover: ${cover}`);
}

export async function getDefaultCover(): Promise<CoverMeta> {
  const about = await getEntry("pages", "about");
  return await getCover(about?.data.cover);
}
