import { SITE } from "~/config";

export function getChildUrl(url: URL, path: string): string {
  return `${url.pathname}/${path}`.replace("//", "/");
}

export function getCanonicalChildUrl(url: URL, path: string): string {
  return `${SITE.url}${getChildUrl(url, path)}`.replace("//", "/");
}
