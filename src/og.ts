import { ImageResponse } from "@vercel/og";
import { ImageMetadata } from "astro";
import { encodeBase64 } from "jsr:@std/encoding";
import path from "node:path";
import sharp from "sharp";
import { OpenGraphImage } from "~/components/OpenGraphImage.tsx";
import { DIMENSIONS } from "~/config.ts";

export interface OpenGraphImageData {
  title: string;
  subtitle?: string;
  description: string;
  image: ImageMetadata;
  cta: string;
}

export async function getSimpleOpenGraphImage(
  image: ImageMetadata,
): Promise<ImageResponse> {
  const buffer = await Deno.readFile(path.join("dist", image.src));
  return new Response(buffer, {
    headers: { "Content-Type": "image/jpeg" },
  });
}

export async function getRichOpenGraphImage({
  title,
  subtitle,
  description,
  image,
  cta,
}: OpenGraphImageData): Promise<ImageResponse> {
  const [avatarBuffer, imageBuffer, regularFontBuffer, boldFontBuffer] =
    await Promise.all([
      Deno.readFile(path.resolve("src/images/me-small.png")),
      Deno.readFile(path.join("dist", image.src)),
      Deno.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff",
      ),
      Deno.readFile(
        "node_modules/@fontsource/fira-sans/files/fira-sans-latin-900-normal.woff",
      ),
    ]);
  const avatar = `data:image/png;base64,${encodeBase64(avatarBuffer)}`;
  const background = `data:image/${
    image.format.replace(
      "jpg",
      "jpeg",
    )
  };base64,${encodeBase64(imageBuffer)}`;
  const og = new ImageResponse(
    OpenGraphImage({ avatar, background, title, subtitle, description, cta }),
    {
      width: DIMENSIONS.opengraph_source_width,
      height: DIMENSIONS.opengraph_source_height,
      fonts: [
        {
          name: "Regular",
          data: regularFontBuffer,
          style: "normal",
        },
        {
          name: "Bold",
          data: boldFontBuffer,
          style: "normal",
        },
      ],
    },
  );
  const png = await og.arrayBuffer();
  const jpeg = await sharp(png)
    .resize(DIMENSIONS.opengraph_width, DIMENSIONS.opengraph_height)
    .jpeg({ quality: 95 })
    .toBuffer();
  return new Response(jpeg, {
    headers: { "Content-Type": "image/jpeg" },
  });
}
