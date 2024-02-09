export function getChildUrl(url: URL, path: string): string {
  return `${url.pathname}/${path}`.replace("//", "/");
}
