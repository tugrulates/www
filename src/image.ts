import { join } from "@jsr/std__path";
import type { ImageMetadata } from "astro";
import { readFile } from "node:fs/promises";
import process from "node:process";
import satori from "satori";
import sharp from "sharp";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS, SITE } from "~/config.ts";
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

async function getImageBuffer(image: string): Promise<Uint8Array | null> {
  if (image.startsWith("/@fs")) {
    return new Uint8Array(
      await Deno.readFile(image.replace(/^\/@fs/, "").replace(/\?[^?]*$/, "")),
    );
  }
  const response = await fetch(getChildUrl(SITE.url, image));
  if (!response.ok) return null;
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * Return a JPEG response with an OpenGraph image.
 *
 * This function runs on Node.js.
 */
export async function getOpenGraphImage(data: {
  title: string;
  subtitle?: string;
  description: string;
  image: ImageMetadata;
  cta: string;
}): Promise<Response> {
  const background = getChildUrl(SITE.url, data.image.src);
  const avatar = getChildUrl(SITE.url, AVATAR.src);

  const [regularFontBuffer, boldFontBuffer] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/FiraSans-Regular.ttf")),
    readFile(join(process.cwd(), "src/fonts/FiraSans-Bold.ttf")),
  ]);

  const svg = await satori(
    OpenGraphImage({ url: SITE.url, avatar, background, ...data }),
    {
      ...DIMENSIONS.opengraph,
      fonts: [
        { name: "Regular", data: regularFontBuffer, style: "normal" },
        { name: "Bold", data: boldFontBuffer, style: "normal" },
      ],
    },
  );
  const jpeg = await sharp(new TextEncoder().encode(svg))
    .resize(DIMENSIONS.opengraph.width, DIMENSIONS.opengraph.height)
    .jpeg({ quality: 95 })
    .toBuffer();

  return new Response(jpeg, { headers: { "Content-Type": "image/jpeg" } });
}
