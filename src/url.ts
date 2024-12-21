import { SITE } from "~/config.ts";

export function getChildPath(url: URL, path: string): string {
  return new URL(`${url}/${path}`).pathname;
}

export function getCanonicalChildPath(url: URL, path: string): string {
  return new URL(getChildPath(url, path), SITE.url).toString();
}
