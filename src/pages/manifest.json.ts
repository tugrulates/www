import type { APIRoute } from "astro";
import { SITE } from "~/config.ts";
import { getFavicon } from "~/image.ts";

const faviconPngSizes = [192, 512];

export const GET: APIRoute = async () => {
  const icons = await Promise.all(
    faviconPngSizes.map(async (size) => {
      const image = await getFavicon(size);
      return {
        src: image.src,
        type: `image/${image.options.format}`,
        sizes: `${image.options.width}x${image.options.height}`,
      };
    })
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
};
