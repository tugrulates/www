import { SITE } from "~/config.ts";

/**
 * Get the path of a child URL.
 *
 * Example:
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * const path = getChildPath(new URL("http://localhost/about"), "feed");
 * assertEquals(path.href, "http://localhost/about/feed");
 * ```
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * const path = getChildPath(new URL("http://localhost"), "og.jpg");
 * assertEquals(path.href, "http://localhost/og.jpg");
 * ```
 *
 * @param url The parent URL.
 * @param path The child path.
 * @returns The canonical path of the child URL with the site domain.
 */
export function getChildPath(url: URL, path: string): URL {
  return new URL(
    `${url.pathname.replace(/\/+/, "")}/${path}`,
    `${url.protocol}${url.host}`,
  );
}

/**
 * Get the canonical path of a child URL.
 *
 * Example:
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * const path = getCanonicalChildPath(new URL("http://localhost/about"), "feed");
 * assertEquals(path.href, "https://www.tugrulates.com/about/feed");
 * ```
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * const path = getCanonicalChildPath(new URL("http://localhost"), "og.jpg");
 * assertEquals(path.href, "https://www.tugrulates.com/og.jpg");
 * ```
 *
 * @param url The parent URL.
 * @param path The child path.
 * @returns The canonical path of the child URL with the site domain.
 */
export function getCanonicalChildPath(url: URL, path: string): URL {
  return new URL(getChildPath(url, path).pathname, SITE.url);
}
