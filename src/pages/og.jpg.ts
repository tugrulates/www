import { join } from "@jsr/std__path";
import { readFile } from "node:fs/promises";

export const prerender = false;

async function getMetadata(path: string): Promise<string | null> {
  try {
    const metadata = await readFile(join(path, "metadata.json"), "utf-8");
    console.log("Found at", path);
    return JSON.parse(metadata);
  } catch {
    console.log("Not found at", path);
    return null;
  }
}

interface Input {
  request: Request;
}

export async function GET({ request }: Input): Promise<Response> {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const metadata = (await getMetadata(path)) ??
    (await getMetadata(join("dist/client", path))) ??
    (await getMetadata(join("client", path))) ??
    (await getMetadata(join("../client", path))) ??
    (await getMetadata(join("server", path))) ??
    (await getMetadata(join("../server", path))) ??
    (await getMetadata(join("static/server", path))) ??
    (await getMetadata(join("static/client", path))) ??
    (await getMetadata(join("../static/server", path))) ??
    (await getMetadata(join("../static/client", path)));
  if (!metadata) return new Response("Not found", { status: 404 });
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
