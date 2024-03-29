import type { APIRoute } from "astro";
import path from "node:path";
import sharp from "sharp";
import ico from "sharp-ico";

async function getFaviconIco(): Promise<Buffer> {
  const src = path.resolve("src/images/me.png");
  const buffer = await sharp(src).resize(32).toFormat("png").toBuffer();
  return ico.encode([buffer]);
}

export const GET: APIRoute = async () => {
  const icoBuffer = await getFaviconIco();
  return new Response(icoBuffer, {
    headers: { "Content-Type": "image/x-icon" },
  });
};
