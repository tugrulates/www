import { APIRoute } from "astro";
import { formatDate } from "~/date.ts";
import { getOpenGraphImage } from "~/node.ts";
import { getEntry } from "~/site.astro";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const photo = await getEntry("photos", params.photo ?? "");
  if (!photo) return new Response("Not found", { status: 404 });
  return await getOpenGraphImage(
    {
      title: photo.data.title,
      description: `${formatDate(photo.data.date)} — ${photo.data.location}`,
      image: photo.data.wide,
      cta: "View photo",
    },
  );
};
