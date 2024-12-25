/**
 * These functions run on Node.js and therefore cannot use the Deno builtins.
 */

import { encodeBase64 } from "@jsr/std__encoding";
import { join } from "@jsr/std__path";
import { ImageMetadata } from "astro";
import { readFile } from "node:fs/promises";
import process from "node:process";
import satori from "satori";
import sharp from "sharp";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS, SITE } from "~/config.ts";
import { getChildUrl } from "~/url.ts";

const FONT = "node_modules/@fontsource/fira-sans/files";

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
  description: string;
  image: ImageMetadata;
  cta: string;
}): Promise<Response> {
  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      readFile(join(process.cwd(), "src/images/me-small.png")),
      await getImageBuffer(data.image.src),
      readFile(join(process.cwd(), FONT, "fira-sans-latin-500-normal.woff")),
      readFile(join(process.cwd(), FONT, "fira-sans-latin-900-normal.woff")),
    ]);
  if (!imageBuffer) return new Response("Not found", { status: 404 });
  const avatar = `data:image/png;base64,${encodeBase64(avatarBuffer)}`;
  const background = `data:image/jpeg;base64,${encodeBase64(imageBuffer)}`;
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
