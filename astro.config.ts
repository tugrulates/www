import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig, envField, fontProviders } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import { SITE } from "./src/config.ts";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: SITE.url.href,
  env: {
    schema: {
      DRAFTS: envField.boolean({
        context: "client",
        access: "public",
        default: false,
      }),
    },
  },
  adapter: vercel(),
  markdown: { rehypePlugins: [[rehypeExternalLinks, { rel: ["nofollow"] }]] },
  fonts: [{
    provider: fontProviders.fontsource(),
    name: "Fira Sans",
    cssVariable: "--font-fira-sans",
  }, {
    provider: fontProviders.fontsource(),
    name: "Fira Code",
    cssVariable: "--font-fira-code",
  }, {
    provider: fontProviders.local(),
    name: "CCSymbols",
    cssVariable: "--font-cc-symbols",
    options: {
      variants: [{
        src: ["./public/fonts/CCSymbols.woff"],
        weight: "normal",
        style: "normal",
      }],
    },
  }],
  prefetch: true,
  trailingSlash: "never",
  integrations: [
    icon({
      include: {
        simple_icons: [
          "github",
          "google",
          "linkedin",
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
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
