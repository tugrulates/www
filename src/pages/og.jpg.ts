import { getEntry } from "astro:content";
import { SITE } from "~/config.ts";
import { getCover, getOpenGraphImage } from "~/image.ts";

export async function GET() {
  const about = await getEntry("pages", "about");
  if (!about) throw new Error("About page not found");
  const cover = await getCover(about.data.cover);
  return await getOpenGraphImage(
    {
      site: SITE.url,
      image: cover.data.wide,
      title: SITE.title,
      subtitle: SITE.description,
      description: about?.data.description,
      cta: "Visit",
    },
  );
}
