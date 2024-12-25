import type { APIContext } from "astro";
import { formatDate } from "~/date.ts";
import { getOpenGraphImage } from "~/image.ts";
import { getEntry } from "~/site.astro";

export const prerender = false;

export async function GET({ params }: APIContext) {
  const photo = await getEntry("photos", params.photo ?? "");
  if (!photo) return new Response("Not found", { status: 404 });
  return await getOpenGraphImage(
    {
      image: photo.data.wide,
      title: photo.data.title,
      description: `${formatDate(photo.data.date)} — ${photo.data.location}`,
      cta: "View photo",
    },
  );
}
