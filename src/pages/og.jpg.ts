import type { APIContext } from "astro";
import { SITE } from "~/config.ts";
import { getCover, getOpenGraphImage } from "~/image.ts";
import { getEntry, NOT_FOUND } from "~/site.astro";

export async function GET({ url }: APIContext): Promise<Response> {
  const about = await getEntry("pages", "about");
  if (!about) return NOT_FOUND;
  const cover = await getCover(about.data.cover);
  return await getOpenGraphImage(
    {
      site: new URL(url.origin),
      image: cover.data.wide,
      title: SITE.title,
      subtitle: SITE.description,
      description: about?.data.description,
      cta: "Visit",
    },
  );
}
