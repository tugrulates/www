import { SITE } from "./src/consts";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import remarkDescription from "astro-remark-description";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  markdown: {
    rehypePlugins: [[rehypeExternalLinks, { rel: ["nofollow"] }]],
    remarkPlugins: [[remarkDescription, {}]],
  },
  prefetch: true,
  integrations: [sitemap(), tailwind(), react(), mdx()],
});
