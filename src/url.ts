import { SITE } from "~/config.ts";

/**
 * Get the pathname of a URL without the leading slash.
 *
 * Example:
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * assertEquals(getRelativePathname(new URL("http://host/about")), "about");
 * assertEquals(getRelativePathname(new URL("http://host/")), "");
 * assertEquals(getRelativePathname(new URL("http://host")), "");
 * ```
 *
 * @param url Any URL.
 * @returns The pathname without the leading slash.
 */
export function getRelativePathname(url: URL): string {
  return url.pathname.replace(/^\//, "");
}

/**
 * Get the path of a full URL.
 *
 * Example:
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * assertEquals(getChildUrl(new URL("http://host"), "feed").href, "http://host/feed");
 * assertEquals(getChildUrl(new URL("http://host/about"), "feed").href, "http://host/about/feed");
 * assertEquals(getChildUrl(new URL("http://host/"), "about", "feed").href, "http://host/about/feed");
 * ```
 *
 * @param url Base URL.
 * @param path The additional path segments.
 * @returns The new URL with child paths.
 */
export function getChildUrl(url: URL, ...path: string[]): URL {
  return new URL(
    [getRelativePathname(url), ...path].join("/").replace(/^\//, ""),
    url.origin,
  );
}

/**
 * Get the canonical site address for a URL.
 *
 * Example:
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * assertEquals(getCanonicalUrl(new URL("http://host/about")).href, "https://www.tugrulates.com/about");
 * assertEquals(getCanonicalUrl(new URL("http://host")).href, "https://www.tugrulates.com/");
 * ```
 *
 * @param url Any URL.
 * @returns The canonical URL.
 * @see SITE
 */
export function getCanonicalUrl(url: URL): URL {
  return getChildUrl(new URL(SITE.url.origin), getRelativePathname(url));
}
