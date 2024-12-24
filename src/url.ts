/**
 * Get the path of a full URL.
 *
 * Example:
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * const path = getUrl(new URL("http://localhost/about"), "photography", "feed");
 * assertEquals(path.href, "http://localhost/photography/feed");
 * ```
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * const path = getUrl(new URL("http://localhost/"), "about", "metadata.json");
 * assertEquals(path.href, "http://localhost/about/metadata.json");
 * ```
 *
 * @param url Any URL containing the protocol and host. Pathname is ignored
 * @param path The path segments.
 * @returns The path of the URL with the site domain.
 */
export function getUrl(url: URL, ...path: string[]): URL {
  return new URL(
    path.join("/").replace(/^\//, ""),
    `${url.protocol}${url.host}`,
  );
}
