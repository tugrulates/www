import type { InferGetStaticPropsType } from "astro";
import { SITE } from "~/config.ts";
import { getPages, getPosts } from "~/content.ts";
import { getCover, getOpenGraphImage } from "~/image.ts";

export async function getStaticPaths() {
  const pages = await getPages();
  const posts = await getPosts();
  return [
    ...pages.map((page) => ({
      params: { post: page.id },
      props: { post: page },
    })),
    ...posts.map((post) => ({
      params: { post: post.id.replace(/^posts\//, "") },
      props: { post },
    })),
  ];
}

interface Context {
  props: InferGetStaticPropsType<typeof getStaticPaths>;
}

export async function GET({ props }: Context) {
  const cover = await getCover(props.post.data.cover);
  return await getOpenGraphImage({
    site: SITE.url,
    image: cover.data.wide,
    title: props.post.data.title,
    cta: "Read more",
    description: props.post.data.description,
  });
}
