import { join } from "@jsr/std__path";
import { readFile } from "node:fs/promises";

export const prerender = false;

interface Input {
  request: Request;
}

export async function GET({ request }: Input): Promise<Response> {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const metadata = JSON.parse(
    await readFile(join("dist/client", path, "metadata.json"), "utf-8"),
  );
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
