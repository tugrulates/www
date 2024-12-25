import { encodeBase64 } from "@jsr/std__encoding";
import type { ImageMetadata, LocalImageService } from "astro";
import satori from "satori";
import sharp from "sharp";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS, SITE } from "~/config.ts";
import { getConfiguredImageService, getEntry, imageConfig } from "~/site.astro";
import { getChildUrl } from "~/url.ts";

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

async function getImageBuffer(image: string): Promise<Uint8Array | null> {
  if (image.startsWith("/@fs")) {
    return new Uint8Array(
      await Deno.readFile(image.replace(/^\/@fs/, "").replace(/\?[^?]*$/, "")),
    );
  }
  const response = await fetch(getChildUrl(SITE.url, image));
  if (!response.ok) return null;
  return new Uint8Array(await response.arrayBuffer());
}

export async function getOpenGraphImage(data: {
  title: string;
  description: string;
  image: ImageMetadata;
  cta: string;
}): Promise<Response> {
  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      Deno.readFile("src/images/me-small.png"),
      await getImageBuffer(data.image.src),
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
    { src: data.image.src, ...DIMENSIONS.opengraph, format: "jpeg" },
    imageConfig,
  );
  const background = `data:image/${resized.format};base64,${
    encodeBase64(resized.data)
  }`;

  const svg = await satori(
    OpenGraphImage({ url: SITE.url, avatar, background, ...data }),
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
