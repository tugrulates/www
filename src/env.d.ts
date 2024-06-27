/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly DRAFTS: boolean;
  readonly RICH_OPENGRAPH_IMAGES: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
