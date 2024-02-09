import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";
import { getEntry } from "astro:content";
import type { CoverMeta, CoverType } from "@/components/Cover.astro";
import OpenGraphImage from "@/components/OpenGraphImage";
import { ImageResponse } from "@vercel/og";
import fs from "fs/promises";
import path from "node:path";
import avatar from "@/images/me.png";

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

export async function getOpenGraphImage(
  title: string,
  description: string,
  image: ImageMetadata,
  cta: string,
): Promise<ImageResponse> {
  const imageBuffer = await fs.readFile(
    process.env.NODE_ENV === "development"
      ? path.resolve(image.src.replace(/\?.*/, "").replace("/@fs", ""))
      : path.resolve(image.src.replace("/", ".vercel/output/static/")),
  );
  const background = `data:image/${image.format.replace("jpg", "jpeg")};base64,${imageBuffer.toString("base64")}`;
  const normalFontBuffer = await fs.readFile(
    "node_modules/@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff",
  );
  const boldFontBuffer = await fs.readFile(
    "node_modules/@fontsource/fira-sans/files/fira-sans-latin-900-normal.woff",
  );
  return new ImageResponse(
    OpenGraphImage({ background, title, description, cta }),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Fira Sans",
          data: normalFontBuffer.buffer,
          style: "normal",
        },
        {
          name: "Fira Sans Bold",
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
