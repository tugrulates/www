import { join } from "@jsr/std__path";
import { SITE } from "~/config.ts";
import { getChildUrl } from "~/url.ts";

export const prerender = false;

interface Input {
  request: Request;
}

export async function GET({ request }: Input): Promise<Response> {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const url = getChildUrl(SITE.url, join(path, "metadata.json"));
  const response = await fetch(url);
  if (!response.ok) return new Response("Not found", { status: 404 });
  const metadata = await response.json();
  // return await getOpenGraphImage({
  //   title: "Tugrul Ates",
  //   subtitle: "Personal Website",
  //   description: `
  //     Hello! I am Tugrul Ates and I love technology, art, and everything in between.
  //     This website is my digital canvas, where I share my thoughts, creations, and
  //     experiences with the world.`,
  //   image,
  //   cta: "Visit",
  // });
  return new Response(JSON.stringify(metadata));
}
