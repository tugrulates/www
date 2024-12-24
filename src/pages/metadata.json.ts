import { SITE } from "~/config.ts";
import { getCover } from "~/image.ts";
import { getEntry, type Metadata } from "~/site.astro";

export async function GET(): Promise<Response> {
  const about = await getEntry("pages", "about");
  const cover = await getCover(about?.data.cover);
  const metadata = {
    data: {
      title: SITE.title,
      subtitle: SITE.description,
      description: about?.data.description,
    },
    cover,
  } satisfies Metadata;
  return new Response(JSON.stringify(metadata));
}
