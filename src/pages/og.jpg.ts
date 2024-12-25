import { SITE } from "~/config.ts";
import { getCover, getOpenGraphImage } from "~/image.ts";
import { getEntry } from "~/site.astro";

export const prerender = false;

export async function GET(): Promise<Response> {
  const about = await getEntry("pages", "about");
  const cover = await getCover(about?.data.cover);
  return await getOpenGraphImage(
    {
      image: cover.data.wide,
      title: SITE.title,
      subtitle: SITE.description,
      description: about?.data.description,
      cta: "Visit",
    },
  );
}
