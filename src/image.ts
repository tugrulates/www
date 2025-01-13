import { encodeBase64 } from "@jsr/std__encoding";
import type { ImageMetadata } from "astro";
import satori from "satori";
import sharp from "sharp";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS } from "~/config.ts";
import { getEntry } from "~/site.astro";
import { getCanonicalUrl } from "~/url.ts";

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

/**
 * Return a JPEG response with an OpenGraph image.
 */
export async function getOpenGraphImage(data: {
  site: URL;
  title: string;
  subtitle?: string;
  description: string;
  image: ImageMetadata;
  cta: string;
}): Promise<Response> {
  const [avatar, regular, bold] = await Promise.all([
    Deno.readFile("src/images/me-small.png"),
    Deno.readFile("src/fonts/FiraSans-Regular.ttf"),
    Deno.readFile("src/fonts/FiraSans-Bold.ttf"),
  ]);
  const background = getCanonicalUrl(data.site, data.image.src).href;

  const svg = await satori(
    OpenGraphImage({
      avatar: `data:image/png;base64,${encodeBase64(avatar)}`,
      background,
      ...data,
    }),
    {
      ...DIMENSIONS.opengraph,
      fonts: [{ name: "Regular", data: regular }, { name: "Bold", data: bold }],
    },
  );

  const jpeg = await sharp(new TextEncoder().encode(svg), { unlimited: true })
    .resize(DIMENSIONS.opengraph.width, DIMENSIONS.opengraph.height)
    .jpeg({ quality: 95 })
    .toBuffer();

  return new Response(jpeg, { headers: { "Content-Type": "image/jpeg" } });
}
