import { SITE } from "./src/consts";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import rehypeExternalLinks from "rehype-external-links";
import remarkDescription from "astro-remark-description";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ["nofollow"],
        },
      ],
    ],
    remarkPlugins: [[remarkDescription, {}]],
  },
  prefetch: true,
  integrations: [
    mdx(),
    react(),
    robotsTxt({
      policy: [
        {
          userAgent: "*",
          allow: "/",
          disallow: "/test/",
        },
      ],
    }),
    sitemap({
      filter: (page) => page !== `${SITE.url}/test/`,
    }),
    tailwind(),
  ],
});
