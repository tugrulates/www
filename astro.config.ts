import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig, envField } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  output: "static",
  env: {
    schema: {
      DRAFTS: envField.boolean({
        context: "client",
        access: "public",
        default: false,
      }),
      RICH_OPENGRAPH_IMAGES: envField.boolean({
        context: "client",
        access: "public",
        default: false,
      }),
    },
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ["nofollow"],
        },
      ],
    ],
  },
  prefetch: true,
  trailingSlash: "never",
  integrations: [
    icon({
      include: {
        simple_icons: [
          "bluesky",
          "github",
          "google",
          "linkedin",
          "instagram",
          "meta",
          "stack-overflow",
          "wikipedia",
          "youtube",
        ],
        heroicons: ["*"],
      },
      iconDir: "public/icons",
    }),
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
