/**
 * These functions run on Node.js and therefore cannot use the Deno builtins.
 */

import { encodeBase64 } from "@jsr/std__encoding";
import { ImageMetadata, LocalImageService } from "astro";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { join } from "path";
import satori from "satori";
import sharp from "sharp";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS, SITE } from "~/config.ts";
import { getConfiguredImageService, imageConfig } from "~/site.astro";
import { getChildUrl } from "~/url.ts";

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
      readFile(
        join(
          process.cwd(),
          "node_modules/@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff",
        ),
      ),
      readFile(
        join(
          process.cwd(),
          "node_modules/@fontsource/fira-sans/files/fira-sans-latin-900-normal.woff",
        ),
      ),
    ]);

  if (!imageBuffer) return new Response("Not found", { status: 404 });

  const avatar = `data:image/png;base64,${encodeBase64(avatarBuffer)}`;
  const imageService = await getConfiguredImageService() as LocalImageService;
  const resized = await imageService.transform(
    imageBuffer,
    { src: data.image.src, ...DIMENSIONS.opengraph, format: "jpeg" },
    imageConfig,
  );
  const background = `data:image/${resized.format};base64,${
    encodeBase64(resized.data)
  }`;

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
