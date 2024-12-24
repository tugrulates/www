import { encodeBase64 } from "@jsr/std__encoding";
import { exists } from "@jsr/std__fs";
import { join } from "@jsr/std__path";
import { ImageResponse } from "@vercel/og";
import type { ImageMetadata, LocalImageService } from "astro";
import sharp from "sharp";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS } from "~/config.ts";
import { getDefaultCover } from "~/image.ts";
import {
  getConfiguredImageService,
  imageConfig,
  type Metadata,
} from "~/site.astro";

export const prerender = false;

export async function getOpenGraphImage(
  data: {
    url: URL;
    title: string;
    subtitle?: string;
    description?: string;
    image: ImageMetadata;
    cta: string;
  },
): Promise<ImageResponse> {
  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      Deno.readFile("src/images/me-small.png"),
      Deno.readFile(
        data.image.src.startsWith("/@fs")
          ? data.image.src.replace(/\/@fs/, "").replace(/\?[^?]+/, "")
          : join("dist/client", data.image.src),
      ),
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
  const og = new ImageResponse(
    OpenGraphImage({ avatar, background, ...data }),
    {
      ...DIMENSIONS.opengraph,
      fonts: [
        { name: "Regular", data: regularFontBuffer, style: "normal" },
        { name: "Bold", data: boldFontBuffer, style: "normal" },
      ],
    },
  );
  const png = await og.arrayBuffer();
  const jpeg = await sharp(png)
    .resize(DIMENSIONS.opengraph.width, DIMENSIONS.opengraph.height)
    .jpeg({ quality: 95 })
    .toBuffer();
  return new Response(jpeg, {
    headers: { "Content-Type": "image/jpeg" },
  });
}

function getCTA(metadata: Metadata): string {
  if (metadata.collection === "posts") return "Read more";
  if (metadata.collection === "photos") return "View photo";
  return "Visit";
}

interface Props {
  request: Request;
}

export async function GET({ request }: Props): Promise<Response> {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "";

  let file = join(path, "metadata.json");
  if (!await exists(file)) file = join("dist/client", file);
  if (!await exists(file)) return new Response("Not found", { status: 404 });

  const metadata = JSON.parse(await Deno.readTextFile(file)) as Metadata;
  return await getOpenGraphImage({
    url,
    ...metadata.data,
    image: (metadata.cover ?? await getDefaultCover())?.data.wide,
    cta: getCTA(metadata),
  });
}
