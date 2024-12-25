import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig, envField } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import { SITE, SSR_FILES } from "./src/config.ts";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: `https://${Deno.env.get("VERCEL_URL") ?? SITE.url.host}`,
  env: {
    schema: {
      DRAFTS: envField.boolean({
        context: "client",
        access: "public",
        default: false,
      }),
    },
  },
  adapter: vercel({
    isr: true,
    includeFiles: SSR_FILES,
  }),
  markdown: { rehypePlugins: [[rehypeExternalLinks, { rel: ["nofollow"] }]] },
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
    robotsTxt({ policy: [{ userAgent: "*", allow: "/", disallow: "/test/" }] }),
    sitemap({ filter: (page) => page !== `${SITE.url}/test/` }),
    tailwind(),
  ],
});
