export function getChildUrl(url: URL, path: string): string {
  return `${url.pathname}/${path}`.replace("//", "/");
}

export function getFullChildUrl(url: URL, path: string): string {
  return `${url.href}/${path}`.replace(/[^:]\/\//, "/");
}
