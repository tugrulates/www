import { getOpenGraphImage } from "~/image.ts";
import { getMetadata } from "~/site.astro";

export const prerender = false;

interface Input {
  request: Request;
}

export async function GET({ request }: Input): Promise<Response> {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const metadata = await getMetadata(path);
  if (!metadata) return new Response("Not found", { status: 404 });
  return await getOpenGraphImage(metadata);
}
