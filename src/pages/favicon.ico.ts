import type { APIRoute } from "astro";
import type { Buffer } from "node:buffer";
import sharp from "sharp";
import ico from "sharp-ico";

async function getFaviconIco(): Promise<Buffer> {
  const buffer = await sharp("src/images/me.png")
    .resize(32)
    .toFormat("png")
    .toBuffer();
  return ico.encode([buffer]);
}

export const GET: APIRoute = async () => {
  const icoBuffer = await getFaviconIco();
  return new Response(icoBuffer, {
    headers: { "Content-Type": "image/x-icon" },
  });
};
