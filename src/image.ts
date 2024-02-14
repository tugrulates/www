import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";
import { getEntry } from "astro:content";
import { ImageResponse } from "@vercel/og";
import type { CoverMeta, CoverType } from "@/components/Cover.astro";
import { OpenGraphImage } from "@/components/OpenGraphImage";
import fs from "fs/promises";
import path from "node:path";
import sharp from "sharp";
import avatar from "@/images/me.png";
import { DIMENSIONS } from "./consts";

export async function getCoverData(cover: CoverType): Promise<CoverMeta> {
  if ("collection" in cover && cover.collection === "photos") {
    const entry = await getEntry("photos", cover.id);
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
  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      fs.readFile(path.resolve("src/images/me-small.png")),
      fs.readFile(
        process.env.NODE_ENV === "development"
          ? path.resolve(image.src.replace(/\?.*/, "").replace("/@fs", ""))
          : path.resolve(image.src.replace("/", ".vercel/output/static/")),
      ),
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
          data: regularFontBuffer.buffer,
          style: "normal",
        },
        {
          name: "Bold",
          data: boldFontBuffer.buffer,
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
  return await getImage({
    src: avatar,
    width: size,
    height: size,
    format: "png",
  });
}
