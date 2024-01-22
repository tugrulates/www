import type { APIRoute } from "astro";
import { getFaviconIco } from "@/favicon";

export const GET: APIRoute = async () => {
  const icoBuffer = await getFaviconIco();
  return new Response(icoBuffer, {
    headers: { "Content-Type": "image/x-icon" },
  });
};
