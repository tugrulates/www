import { APIRoute } from "astro";
import { SITE } from "~/config.ts";
import { getCover } from "~/image.ts";
import { getOpenGraphImage } from "~/node.ts";
import { getEntry } from "~/site.astro";

export const prerender = false;

export const GET: APIRoute = async () => {
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
};
