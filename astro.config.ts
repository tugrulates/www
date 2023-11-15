import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import remarkToc from 'remark-toc';
import remarkDescription from 'astro-remark-description'

// https://astro.build/config
export default defineConfig({
  site: 'https://tugrul.blog',
  markdown: {
    remarkPlugins: [remarkToc, [remarkDescription, {}]],
  },
  integrations: [sitemap(), preact({ compat: true }), tailwind()]
});
