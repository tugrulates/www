import { ImageResponse } from "@vercel/og";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { AVATAR, getEntry, getImage } from "~/site.astro";
import type { GetImageResult } from "astro";

export async function getCoverData(cover: CoverType): Promise<CoverMeta> {
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

export async function getFavicon(size?: number): Promise<GetImageResult> {
  return await getImage({
    src: AVATAR,
    width: size,
    height: size,
    format: "png",
  });
}

export interface OpenGraphImageData {
  title: string;
  subtitle?: string;
  description: string;
  image: ImageData;
  cta: string;
}

/**
 * @todo Fix with SSR.
 */
export function getOpenGraphImage(_: OpenGraphImageData): ImageResponse {
  return new Response("Not found", { status: 404 });
}
