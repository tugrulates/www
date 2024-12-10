import { SITE } from "~/config";

export function getChildUrl(url: URL, path: string): string {
  return new URL(path, url).pathname;
}

export function getCanonicalChildUrl(url: URL, path: string): string {
  return new URL(getChildUrl(url, path), SITE.url).toString();
}
