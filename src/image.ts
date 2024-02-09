import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";
import { getEntry } from "astro:content";
import type { CoverMeta, CoverType } from "@/components/Cover.astro";
import {
  OpenGraphImageSquare,
  OpenGraphImageWide,
} from "@/components/OpenGraphImage";
import { ImageResponse } from "@vercel/og";
import fs from "fs/promises";
import path from "node:path";
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

export type OpenGraphImageSize = "wide" | "square";
export interface OpenGraphImageData {
  size: OpenGraphImageSize;
  title: string;
  description: string;
  image: ImageMetadata;
  cta: string;
}

export async function getOpenGraphImage({
  size,
  title,
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
  return new ImageResponse(
    size === "wide"
      ? OpenGraphImageWide({ avatar, background, title, cta, description })
      : OpenGraphImageSquare({ avatar, background, title, cta }),
    {
      width:
        size === "wide"
          ? DIMENSIONS.opengraph_wide_width
          : DIMENSIONS.opengraph_square_size,
      height:
        size === "wide"
          ? DIMENSIONS.opengraph_wide_height
          : DIMENSIONS.opengraph_square_size,
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
}

export async function getFavicon(size?: number): Promise<GetImageResult> {
  return await getImage({
    src: avatar,
    width: size,
    height: size,
    format: "png",
  });
}
