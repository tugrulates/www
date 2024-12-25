import type { InferGetStaticPropsType } from "astro";
import { getPages, getPosts } from "~/content.ts";
import { getCover, getOpenGraphImage } from "~/image.ts";

export async function getStaticPaths() {
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
}

interface Input {
  props: InferGetStaticPropsType<typeof getStaticPaths>;
}

export async function GET({ props }: Input): Promise<Response> {
  const cover = await getCover(props.cover);
  return await getOpenGraphImage({ ...props, image: cover.data.wide });
}
