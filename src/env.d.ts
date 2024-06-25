/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SITE_GENERATE_RICH_OPENGRAPH_IMAGES: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
