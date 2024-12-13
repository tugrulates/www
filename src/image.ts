import { ImageResponse } from "@vercel/og";
import type { GetImageResult, ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import { getEntry } from "astro:content";
import { RICH_OPENGRAPH_IMAGES } from "astro:env/client";
import fs from "fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage";
import { DIMENSIONS } from "~/config";
import avatar from "~/images/me.png";

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

export interface OpenGraphImageData {
  title: string;
  subtitle?: string;
  description: string;
  image: ImageMetadata;
  cta: string;
}

export async function getOpenGraphImage({
  title,
  subtitle,
  description,
  image,
  cta,
}: OpenGraphImageData): Promise<ImageResponse> {
  if (RICH_OPENGRAPH_IMAGES) {
    return await getRichOpenGraphImage({
      title,
      subtitle,
      description,
      image,
      cta,
    });
  } else {
    return await getSimpleOpenGraphImage(image);
  }
}

export async function getSimpleOpenGraphImage(
  image: ImageMetadata,
): Promise<ImageResponse> {
  const imageBuffer = await fs.readFile(path.join("dist", image.src));
  return new Response(imageBuffer, {
    headers: { "Content-Type": "image/jpeg" },
  });
}

export async function getRichOpenGraphImage({
  title,
  subtitle,
  description,
  image,
  cta,
}: OpenGraphImageData): Promise<ImageResponse> {
  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      fs.readFile(path.resolve("src/images/me-small.png")),
      fs.readFile(path.join("dist", image.src)),
      fs.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff",
      ),
      fs.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-900-normal.woff",
      ),
    ]);
  const avatar = `data:image/png;base64,${avatarBuffer.toString("base64")}`;
  const background = `data:image/${image.format.replace("jpg", "jpeg")};base64,${imageBuffer.toString("base64")}`;
  const og = new ImageResponse(
    OpenGraphImage({ avatar, background, title, subtitle, description, cta }),
    {
      width: DIMENSIONS.opengraph_source_width,
      height: DIMENSIONS.opengraph_source_height,
      fonts: [
        {
          name: "Regular",
          data: regularFontBuffer,
          style: "normal",
        },
        {
          name: "Bold",
          data: boldFontBuffer,
          style: "normal",
        },
      ],
    },
  );
  const png = await og.arrayBuffer();
  const jpeg = await sharp(png)
    .resize(DIMENSIONS.opengraph_width, DIMENSIONS.opengraph_height)
    .jpeg({ quality: 95 })
    .toBuffer();
  return new Response(jpeg, {
    headers: { "Content-Type": "image/jpeg" },
  });
}

export async function getFavicon(size?: number): Promise<GetImageResult> {
  return getImage({
    src: avatar,
    width: size,
    height: size,
    format: "png",
  });
}
