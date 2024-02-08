import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";
import { getEntry, type CollectionEntry } from "astro:content";
import type { CoverData } from "@/components/Cover.astro";
import { ImageResponse } from "@vercel/og";
import path from "node:path";
import sharp from "sharp";
import ico from "sharp-ico";
import avatar from "@/images/me.png";
import OpenGraphImage from "./components/OpenGraphImage.astro";

export async function getPageCover(
  page: CollectionEntry<"pages"> | CollectionEntry<"posts">,
): Promise<CoverData> {
  if (
    "collection" in page.data.cover &&
    page.data.cover.collection === "photos"
  ) {
    const entry = await getEntry(page.data.cover);
    return entry;
  }
  if ("data" in page.data.cover) {
    return {
      id: undefined,
      data: page.data.cover.data,
    };
  }
  throw new Error(`Invalid page: ${page.id}`);
}

export async function getOpenGraphImage(
  image: ImageMetadata,
): Promise<ImageResponse> {
  // const buffer = await fs.readFile(
  //   process.env.NODE_ENV === "development"
  //     ? path.resolve(image.src.replace(/\?.*/, "").replace("/@fs", ""))
  //     : path.resolve(image.src.replace("/", "dist/")),
  // );
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "white",
          backgroundImage: `url(${image.src})`,
          backgroundSize: "100px 100px",
          fontFamily: "Fira Sans",
        }}
      >
        <div>test</div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      // fonts: [
      //   {
      //     name: "DM Sans Bold",
      //     data: DmSansBold.buffer,
      //     style: "normal",
      //   },
      //   {
      //     name: "DM Sans Regular",
      //     data: DmSansReqular.buffer,
      //     style: "normal",
      //   },
      // ],
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
