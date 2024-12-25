import { APIRoute } from "astro";
import { formatDate } from "~/date.ts";
import { getOpenGraphImage } from "~/image.ts";
import { getEntry } from "~/site.astro";

export const prerender = false;

// export async function getStaticPaths() {
//   const photos = await getPhotos();
//   return photos.map((photo) => ({
//     params: { photo: photo.id },
//     props: {
//       url: SITE.url,
//       title: photo.data.title,
//       description: `${formatDate(photo.data.date)} — ${photo.data.location}`,
//       image: photo.data.wide,
//       cta: "View photo",
//     },
//   }));
// }

// interface Input {
//   props: InferGetStaticPropsType<typeof getStaticPaths>;
// }

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
