import { SITE } from "~/config.ts";
import { getFavicon } from "~/pages/favicon.ico.ts";

const faviconPngSizes = [192, 512];

export async function GET(): Promise<Response> {
  const icons = await Promise.all(
    faviconPngSizes.map(async (size) => {
      const image = await getFavicon(size);
      return {
        src: image.src,
        type: `image/${image.options.format}`,
        sizes: `${image.options.width}x${image.options.height}`,
      };
    }),
  );

  const manifest = {
    name: SITE.title,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    id: "www.tugrulates.com",
    icons,
  };

  return new Response(JSON.stringify(manifest));
}
