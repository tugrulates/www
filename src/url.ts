/**
 * Get the path of a full URL.
 *
 * Example:
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * assertEquals(getChildUrl(new URL("http://host"), "/about").href, "http://host/about");
 * assertEquals(getChildUrl(new URL("http://host"), "feed").href, "http://host/feed");
 * assertEquals(getChildUrl(new URL("http://host/about"), "feed").href, "http://host/about/feed");
 * assertEquals(getChildUrl(new URL("http://host/"), "about", "feed").href, "http://host/about/feed");
 * ```
 *
 * @param url Any URL containing the protocol and host, and optional pathname.
 * @param path The additional path segments.
 * @returns The new URL with child paths.
 */
export function getChildUrl(url: URL, ...path: string[]): URL {
  return new URL(
    [url.pathname, ...path].join("/").replace(/^\//, "").replace(/^\//, ""),
    `${url.protocol}${url.host}`,
  );
}
