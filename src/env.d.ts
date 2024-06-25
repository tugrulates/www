/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly RICH_OPENGRAPH_IMAGES: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
