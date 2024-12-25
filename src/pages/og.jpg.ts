import { encodeBase64 } from "@jsr/std__encoding";
import type { APIRoute, LocalImageService } from "astro";
import satori from "satori";
import sharp from "sharp";
import type { CoverMeta } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS, SITE } from "~/config.ts";
import { getCover } from "~/image.ts";
import {
  getConfiguredImageService,
  getEntry,
  getMetadata,
  imageConfig,
  type Metadata,
} from "~/site.astro";
import { getChildUrl } from "~/url.ts";

export const prerender = false;

function getCta(metadata: Metadata): string {
  if (metadata.collection === "posts") return "Read more";
  if (metadata.collection === "photos") return "View photo";
  return "Visit";
}

async function getDefaultCover(): Promise<CoverMeta> {
  const about = await getEntry("pages", "about");
  return await getCover(about?.data.cover);
}

async function getImageBuffer(image: string): Promise<Uint8Array | null> {
  const response = await fetch(getChildUrl(SITE.url, image));
  if (!response.ok) return null;
  return new Uint8Array(await response.arrayBuffer());
}

async function getOpenGraphImage(metadata: Metadata): Promise<Response> {
  const image = (metadata.cover ?? await getDefaultCover()).data.wide;

  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      Deno.readFile("src/images/me-small.png"),
      await getImageBuffer(image.src),
      Deno.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff",
      ),
      Deno.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-900-normal.woff",
      ),
    ]);

  if (!imageBuffer) return new Response("Not found", { status: 404 });

  const avatar = `data:image/png;base64,${encodeBase64(avatarBuffer)}`;
  const imageService = await getConfiguredImageService() as LocalImageService;
  const resized = await imageService.transform(
    imageBuffer,
    { src: image.src, ...DIMENSIONS.opengraph, format: "jpeg" },
    imageConfig,
  );
  const background = `data:image/${resized.format};base64,${
    encodeBase64(resized.data)
  }`;

  const svg = await satori(
    OpenGraphImage({
      ...metadata.data,
      url: SITE.url,
      avatar,
      background,
      cta: getCta(metadata),
    }),
    {
      ...DIMENSIONS.opengraph,
      fonts: [
        { name: "Regular", data: regularFontBuffer, style: "normal" },
        { name: "Bold", data: boldFontBuffer, style: "normal" },
      ],
    },
  );

  const jpeg = await sharp(new TextEncoder().encode(svg))
    .resize(DIMENSIONS.opengraph.width, DIMENSIONS.opengraph.height)
    .jpeg({ quality: 95 })
    .toBuffer();
  return new Response(jpeg, { headers: { "Content-Type": "image/jpeg" } });
}

export const GET: APIRoute = async ({ request }) => {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const metadata = await getMetadata(path);
  if (!metadata) return new Response("Not found", { status: 404 });
  return await getOpenGraphImage(metadata);
};
