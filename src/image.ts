import { join } from "@jsr/std__path";
import type { ImageMetadata } from "astro";
import { readFile } from "node:fs/promises";
import process from "node:process";
import satori from "satori";
import sharp from "sharp";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS } from "~/config.ts";
import { getEntry } from "~/site.astro";
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

async function getFont(
  name: string,
): Promise<{ name: string; data: ArrayBuffer }> {
  const data = await readFile(
    join(process.cwd(), `/public/fonts/FiraSans-${name}.ttf`),
  );
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
  const [avatar, regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "src/images/me-small.png")),
    readFile(join(process.cwd(), "src/fonts/FiraSans-Regular.ttf")),
    readFile(join(process.cwd(), "src/fonts/FiraSans-Bold.ttf")),
  ]);
  const svg = await satori(
    OpenGraphImage({
      avatar: `data:image/png;base64,${avatar.toString("base64")}`,
      background: getChildUrl(getChildUrl(data.site, data.image.src)),
      ...data,
    }),
    {
      ...DIMENSIONS.opengraph,
      fonts: [{ name: "Regular", data: regular }, { name: "Bold", data: bold }],
    },
  );

  const jpeg = await sharp(new TextEncoder().encode(svg))
    .resize(DIMENSIONS.opengraph.width, DIMENSIONS.opengraph.height)
    .jpeg({ quality: 95 })
    .toBuffer();

  return new Response(jpeg, { headers: { "Content-Type": "image/jpeg" } });
}
