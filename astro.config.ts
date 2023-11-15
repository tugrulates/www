import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import remarkDescription from 'astro-remark-description';

// https://astro.build/config
export default defineConfig({
  site: 'https://tugrul.blog',
  markdown: {
    remarkPlugins: [[remarkDescription, {}]]
  },
  integrations: [sitemap(), tailwind(), react()]
});
