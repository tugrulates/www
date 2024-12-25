import { encodeBase64 } from "@jsr/std__encoding";
import { exists } from "@jsr/std__fs";
import { join } from "@jsr/std__path";
import type { ImageMetadata, LocalImageService } from "astro";
import satori from "satori";
import sharp from "sharp";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS } from "~/config.ts";
import {
  getConfiguredImageService,
  imageConfig,
  type Metadata,
} from "~/site.astro";

export const prerender = false;

async function getOpenGraphImage(
  data: {
    url: URL;
    title: string;
    subtitle?: string;
    description?: string;
    image: ImageMetadata;
    cta: string;
  },
): Promise<Response> {
  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      Deno.readFile("src/images/me-small.png"),
      Deno.readFile(join("dist/client", data.image.src)),
      Deno.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff",
      ),
      Deno.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-900-normal.woff",
      ),
    ]);
  const avatar = `data:image/png;base64,${encodeBase64(avatarBuffer)}`;
  const imageService = await getConfiguredImageService() as LocalImageService;
  const resized = await imageService.transform(
    imageBuffer,
    { src: data.image.src, ...DIMENSIONS.opengraph, format: "jpeg" },
    imageConfig,
  );
  const background = `data:image/${
    data.image.format.replace("jpg", "jpeg")
  };base64,${encodeBase64(resized.data)}`;

  const svg = await satori(OpenGraphImage({ avatar, background, ...data }), {
    ...DIMENSIONS.opengraph,
    fonts: [
      { name: "Regular", data: regularFontBuffer, style: "normal" },
      { name: "Bold", data: boldFontBuffer, style: "normal" },
    ],
  });

  const jpeg = await sharp(new TextEncoder().encode(svg))
    .resize(DIMENSIONS.opengraph.width, DIMENSIONS.opengraph.height)
    .jpeg({ quality: 95 })
    .toBuffer();
  return new Response(jpeg, { headers: { "Content-Type": "image/jpeg" } });
}

function getCTA(metadata: Metadata): string {
  if (metadata.collection === "posts") return "Read more";
  if (metadata.collection === "photos") return "View photo";
  return "Visit";
}

interface Input {
  request: Request;
}

export async function GET({ request }: Input): Promise<Response> {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "";

  const file = join("dist/client", path, "metadata.json");
  if (!await exists(file)) return new Response("Not found", { status: 404 });
  const metadata = JSON.parse(await Deno.readTextFile(file)) as Metadata;
  return new Response(JSON.stringify(metadata));

  // return await getOpenGraphImage({
  //   url,
  //   ...metadata.data,
  //   image: (metadata.cover ?? await getDefaultCover())?.data.wide,
  //   cta: getCTA(metadata),
  // });
}
