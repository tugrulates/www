import {
  ImageMagick,
  type IMagickImage,
  initializeImageMagick,
  MagickFormat,
} from "@imagemagick/magick-wasm";
import { encodeBase64 } from "@jsr/std__encoding";
import { exists } from "@jsr/std__fs";
import { join } from "@jsr/std__path";
import type { ImageMetadata, LocalImageService } from "astro";
import satori from "satori";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS } from "~/config.ts";
import { getDefaultCover } from "~/image.ts";
import {
  getConfiguredImageService,
  imageConfig,
  type Metadata,
} from "~/site.astro";

export const prerender = false;

export const IMAGEMAGICK_WASM =
  "https://cdn.jsdelivr.net/npm/@imagemagick/magick-wasm@0.0.32/dist/magick.wasm";

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
  const background = `data:image/${resized.format};base64,${
    encodeBase64(resized.data)
  }`;

  const svg = await satori(OpenGraphImage({ avatar, background, ...data }), {
    ...DIMENSIONS.opengraph,
    fonts: [
      { name: "Regular", data: regularFontBuffer, style: "normal" },
      { name: "Bold", data: boldFontBuffer, style: "normal" },
    ],
  });

  await initializeImageMagick(IMAGEMAGICK_WASM);
  const jpeg = await ImageMagick.read(
    new TextEncoder().encode(svg),
    async (img: IMagickImage) => {
      img.resize(DIMENSIONS.opengraph.width, DIMENSIONS.opengraph.height);
      return await img.write(
        MagickFormat.Jpeg,
        async (data: Uint8Array) => {
          await Promise.resolve();
          return data;
        },
      );
    },
  );
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

  return await getOpenGraphImage({
    url,
    ...metadata.data,
    image: (metadata.cover ?? await getDefaultCover())?.data.wide,
    cta: getCTA(metadata),
  });
}
