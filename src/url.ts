import { SITE } from "~/config.ts";

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
    [url.pathname, ...path]
      .map((p) => p.replace(/^\//, ""))
      .filter((p) => p)
      .join("/"),
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
 * assertEquals(getCanonicalUrl(new URL("http://host"), "about").href, "https://www.tugrulates.com/about");
 * ```
 *
 * @param url Any URL.
 * @param path The additional path segments.
 * @returns The canonical URL.
 * @see SITE
 */
export function getCanonicalUrl(url: URL, ...path: string[]): URL {
  return getChildUrl(new URL(SITE.url.origin), url.pathname, ...path);
}
