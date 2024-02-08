import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";
import { getEntry } from "astro:content";
import type { CoverMeta, CoverType } from "@/components/Cover.astro";
import { ImageResponse } from "@vercel/og";
import fs from "fs/promises";
import path from "node:path";
import sharp from "sharp";
import ico from "sharp-ico";
import avatar from "@/images/me.png";
import { SITE } from "@/consts";

export async function getCoverData(cover: CoverType): Promise<CoverMeta> {
  if ("collection" in cover && cover.collection === "photos") {
    const entry = await getEntry("photos", cover.id);
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

interface OpenGraphImageProps {
  image: Buffer;
  format: string;
  title: string;
  description: string;
  cta: string;
}

/* eslint-disable react/no-unknown-property */
const OpenGraphImage = ({
  image,
  format,
  title,
  description,
  cta,
}: OpenGraphImageProps): JSX.Element => {
  return (
    <div
      tw="text-2xl relative flex flex-col w-full h-full px-32 py-16 gap-4 items-center justify-between bg-black text-white"
      style={{ fontFamily: "Fira Sans" }}
    >
      <div tw="absolute inset-0 flex object-cover opacity-25">
        <img
          src={`data:image/${format.replace("jpg", "jpeg")};base64,${image.toString("base64")}`}
        />
      </div>
      <div tw="px-4 py-2 rounded-full text-black bg-stone-200 shadow-lg shadow-stone-200/25 ">
        {SITE.domain}
      </div>
      <h1 style={{ fontFamily: "Fira Sans Bold" }}>{title}</h1>
      <p>{description}</p>
      <div tw="px-8 py-4 rounded-2xl bg-indigo-800 shadow-lg shadow-indigo-900/25">
        {cta}
      </div>
    </div>
  );
};

export async function getOpenGraphImage(
  title: string,
  description: string,
  image: ImageMetadata,
  cta: string,
): Promise<ImageResponse> {
  const imageBuffer = await fs.readFile(
    process.env.NODE_ENV === "development"
      ? path.resolve(image.src.replace(/\?.*/, "").replace("/@fs", ""))
      : path.resolve(image.src.replace("/", "dist/")),
  );
  const normalFontBuffer = await fs.readFile(
    "node_modules/@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff",
  );
  const boldFontBuffer = await fs.readFile(
    "node_modules/@fontsource/fira-sans/files/fira-sans-latin-900-normal.woff",
  );
  return new ImageResponse(
    (
      <OpenGraphImage
        image={imageBuffer}
        format={image.format}
        title={title}
        description={description}
        cta={cta}
      />
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Fira Sans",
          data: normalFontBuffer.buffer,
          style: "normal",
        },
        {
          name: "Fira Sans Bold",
          data: boldFontBuffer.buffer,
          style: "normal",
        },
      ],
    },
  );
}

export async function getFavicon(size?: number): Promise<GetImageResult> {
  return await getImage({
    src: avatar,
    width: size,
    height: size,
    format: "png",
  });
}

export async function getFaviconIco(): Promise<Buffer> {
  const src = path.resolve("src/images/me.png");
  const buffer = await sharp(src).resize(32).toFormat("png").toBuffer();
  return ico.encode([buffer]);
}
