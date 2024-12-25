import { getMetadata } from "~/site.astro";

export const prerender = false;

interface Input {
  request: Request;
}

export async function GET({ request }: Input): Promise<Response> {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const metadata = await getMetadata(path);
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
