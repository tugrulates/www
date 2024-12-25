import type { GetImageResult } from "astro";
import type { Buffer } from "node:buffer";
import sharp from "sharp";
import ico from "sharp-ico";
import { AVATAR, getImage } from "~/site.astro";

async function getFaviconIco(): Promise<Buffer> {
  const buffer = await sharp("src/images/me.png")
    .resize(32)
    .toFormat("png")
    .toBuffer();
  return ico.encode([buffer]);
}

export async function getFavicon(size?: number): Promise<GetImageResult> {
  return await getImage({
    src: AVATAR,
    width: size,
    height: size,
    format: "png",
  });
}

export async function GET(): Promise<Response> {
  const icoBuffer = await getFaviconIco();
  return new Response(icoBuffer, {
    headers: { "Content-Type": "image/x-icon" },
  });
}
