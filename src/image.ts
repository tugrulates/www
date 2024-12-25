import { encodeBase64 } from "@jsr/std__encoding";
import { join } from "@jsr/std__path";
import type { LocalImageService } from "astro";
import satori from "satori";
import sharp from "sharp";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS, SITE } from "~/config.ts";
import {
  getConfiguredImageService,
  getEntry,
  imageConfig,
  Metadata,
} from "~/site.astro";

export async function getCover(cover: CoverType): Promise<CoverMeta> {
  if ("collection" in cover && cover.collection === "photos") {
    const entry = await getEntry("photos", cover.id);
    if (!entry) throw new Error(`Photo not found: ${cover.id}`);
    return entry;
  }
  if ("wide" in cover) {
    return {
      id: undefined,
      data: cover,
    };
  }
  throw new Error(`Invalid cover: ${cover}`);
}

export async function getDefaultCover(): Promise<CoverMeta> {
  const about = await getEntry("pages", "about");
  return await getCover(about?.data.cover);
}

export function getCta(metadata: Metadata): string {
  if (metadata.collection === "posts") return "Read more";
  if (metadata.collection === "photos") return "View photo";
  return "Visit";
}

export async function getOpenGraphImage(metadata: Metadata): Promise<Response> {
  const image = (metadata.cover ?? await getDefaultCover()).data.wide;
  const cta = getCta(metadata);

  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      Deno.readFile("src/images/me-small.png"),
      Deno.readFile(
        image.src.startsWith("/@fs")
          ? image.src.replace(/\/@fs/, "").replace(/\?[^?]*$/, "")
          : join("dist/server", image.src),
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
    { src: image.src, ...DIMENSIONS.opengraph, format: "jpeg" },
    imageConfig,
  );
  const background = `data:image/${resized.format};base64,${
    encodeBase64(resized.data)
  }`;

  const svg = await satori(
    OpenGraphImage({
      url: SITE.url,
      avatar,
      background,
      cta,
      ...metadata.data,
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
