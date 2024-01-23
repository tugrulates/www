import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";
import path from "node:path";
import sharp from "sharp";
import ico from "sharp-ico";
import avatar from "@/images/me.png";

export async function getOgImage(
  image: ImageMetadata,
): Promise<GetImageResult> {
  return await getImage({
    src: image,
    width: Math.min(3200, image.width),
    format: "jpg",
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

export async function getFaviconIco(): Promise<Buffer> {
  const src = path.resolve("src/images/me.png");
  const buffer = await sharp(src).resize(32).toFormat("png").toBuffer();
  return ico.encode([buffer]);
}
