import type { ImageMetadata } from "astro";
import satori from "satori";
import sharp from "sharp";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS } from "~/config.ts";
import { AVATAR, getEntry } from "~/site.astro";
import { getCanonicalUrl } from "~/url.ts";

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

async function fetchFont(
  site: URL,
  name: string,
): Promise<{ name: string; data: ArrayBuffer }> {
  const response = await fetch(
    getCanonicalUrl(
      site,
      `fonts/FiraSans-${name}.ttf`,
    ).href,
  );
  if (!response.ok) throw new Error(`Font not found: ${name}`);
  const data = await response.arrayBuffer();
  return { name, data };
}

/**
 * Return a JPEG response with an OpenGraph image.
 *
 * This function runs on Node.js.
 */
export async function getOpenGraphImage(data: {
  site: URL;
  title: string;
  subtitle?: string;
  description: string;
  image: ImageMetadata;
  cta: string;
}): Promise<Response> {
  const [regular, bold] = await Promise.all([
    fetchFont(data.site, "Regular"),
    fetchFont(data.site, "Bold"),
  ]);
  const avatar = getCanonicalUrl(data.site, AVATAR.src).href;
  const background = getCanonicalUrl(data.site, data.image.src).href;

  const svg = await satori(
    OpenGraphImage({ avatar, background, ...data }),
    { ...DIMENSIONS.opengraph, fonts: [regular, bold] },
  );

  const jpeg = await sharp(new TextEncoder().encode(svg))
    .resize(DIMENSIONS.opengraph.width, DIMENSIONS.opengraph.height)
    .jpeg({ quality: 95 })
    .toBuffer();

  return new Response(jpeg, { headers: { "Content-Type": "image/jpeg" } });
}
