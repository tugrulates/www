import type { ImageResponse } from "@vercel/og";
import type { GetStaticPaths } from "astro";
import type { CoverType } from "~/components/Cover.astro";
import { getPages, getPosts } from "~/content.ts";
import { getCoverData, getOpenGraphImage } from "~/image.ts";

export const getStaticPaths = (async () => {
  const [pages, posts] = await Promise.all([getPages(), getPosts()]);
  return [...pages, ...posts].map((post) => ({
    params: { post: post.id.replace(/^posts\//, "") },
    props: {
      title: post.data.title,
      cover: post.data.cover,
      cta: "Read more",
      description: post.data.description,
    },
  }));
}) satisfies GetStaticPaths;

interface Props {
  params: { post: string };
  props: {
    title: string;
    description: string;
    cover: CoverType;
    cta: string;
  };
}
export const GET = async ({
  props: { title, cover, cta, description },
}: Props): Promise<ImageResponse> => {
  const coverData = await getCoverData(cover);
  const image = coverData.data.wide;
  return await getOpenGraphImage({ title, description, image, cta });
};
