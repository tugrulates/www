import type { ImageMetadata } from "astro";
import satori from "satori";
import sharp from "sharp";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS } from "~/config.ts";
import { AVATAR, getEntry } from "~/site.astro";
import { getChildUrl } from "~/url.ts";

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
  const background = getChildUrl(data.site, data.image.src);
  const avatar = getChildUrl(data.site, AVATAR.src);

  console.log(
    "Fetching fonts...",
    getChildUrl(data.site, "fonts/FiraSans-Regular.ttf"),
  );
  const [regular, bold] = await Promise.all(
    ["fonts/FiraSans-Regular.ttf", "fonts/FiraSans-Bold.ttf"].map(
      async (f) => await (await fetch(getChildUrl(data.site, f))).arrayBuffer(),
    ),
  );

  const svg = await satori(
    OpenGraphImage({ avatar, background, ...data }),
    {
      ...DIMENSIONS.opengraph,
      fonts: [
        { name: "Regular", data: regular, style: "normal" },
        { name: "Bold", data: bold, style: "normal" },
      ],
    },
  );

  const jpeg = await sharp(new TextEncoder().encode(svg))
    .resize(DIMENSIONS.opengraph.width, DIMENSIONS.opengraph.height)
    .jpeg({ quality: 95 })
    .toBuffer();

  return new Response(jpeg, { headers: { "Content-Type": "image/jpeg" } });
}
