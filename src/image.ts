import { encodeBase64 } from "@jsr/std__encoding";
import { join } from "@jsr/std__path";
import { ImageResponse } from "@vercel/og";
import type { GetImageResult, ImageMetadata } from "astro";
import sharp from "sharp";
import type { CoverMeta, CoverType } from "~/components/Cover.astro";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS } from "~/config.ts";
import {
  AVATAR,
  getEntry,
  getImage,
  RICH_OPENGRAPH_IMAGES,
} from "~/site.astro";

export async function getCoverData(cover: CoverType): Promise<CoverMeta> {
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

export async function getFavicon(size?: number): Promise<GetImageResult> {
  return await getImage({
    src: AVATAR,
    width: size,
    height: size,
    format: "png",
  });
}

export interface OpenGraphImageData {
  title: string;
  subtitle?: string;
  description: string;
  image: ImageMetadata;
  cta: string;
}

export async function getOpenGraphImage({
  title,
  subtitle,
  description,
  image,
  cta,
}: OpenGraphImageData): Promise<ImageResponse> {
  if (RICH_OPENGRAPH_IMAGES) {
    return await getRichOpenGraphImage({
      title,
      subtitle,
      description,
      image,
      cta,
    });
  } else {
    return await getSimpleOpenGraphImage(image);
  }
}

async function getSimpleOpenGraphImage(
  image: ImageMetadata,
): Promise<ImageResponse> {
  const buffer = await Deno.readFile(join("dist", image.src));
  return new Response(buffer, {
    headers: { "Content-Type": "image/jpeg" },
  });
}

async function getRichOpenGraphImage(
  data: OpenGraphImageData,
): Promise<ImageResponse> {
  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      Deno.readFile("src/images/me-small.png"),
      Deno.readFile(join("dist", data.image.src)),
      Deno.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff",
      ),
      Deno.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-900-normal.woff",
      ),
    ]);
  const avatar = `data:image/png;base64,${encodeBase64(avatarBuffer)}`;
  const background = `data:image/${
    data.image.format.replace(
      "jpg",
      "jpeg",
    )
  };base64,${encodeBase64(imageBuffer)}`;
  const og = new ImageResponse(
    OpenGraphImage({ avatar, background, ...data }),
    {
      ...DIMENSIONS.opengraph.source,
      fonts: [
        { name: "Regular", data: regularFontBuffer, style: "normal" },
        { name: "Bold", data: boldFontBuffer, style: "normal" },
      ],
    },
  );
  const png = await og.arrayBuffer();
  const jpeg = await sharp(png)
    .resize(
      DIMENSIONS.opengraph.target.width,
      DIMENSIONS.opengraph.target.height,
    )
    .jpeg({ quality: 95 })
    .toBuffer();
  return new Response(jpeg, {
    headers: { "Content-Type": "image/jpeg" },
  });
}
