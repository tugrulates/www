import { APIContext, MiddlewareNext } from "astro";
import { sequence } from "~/site.astro";

const HEADERS = [
  // CSP headers
  {
    source: /\/(.*)/,
    headers: {
      "Content-Security-Policy":
        "default-src 'none'; connect-src 'self' https://vercel.live https://*.pusher.com wss://*.pusher.com; font-src 'self' https://vercel.live https://*.vercel.com https://fonts.gstatic.com; frame-src 'self' https://vercel.live https://www.youtube-nocookie.com; img-src 'self' data: https://vercel.com https://i.ytimg.com; manifest-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline' https://vercel.live; base-uri 'none'; form-action 'none'; frame-ancestors 'none';",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  },
  // Cache headers
  {
    source: /\/_astro\/(.*)/,
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=0",
    },
  },
];

async function addHeaders(context: APIContext, next: MiddlewareNext) {
  const response = await next();
  const headers = new Headers(response.headers);
  const path = new URL(context.url).pathname;
  for (const { source, headers: header } of HEADERS) {
    if (source.test(path)) {
      for (const [key, value] of Object.entries(header)) {
        headers.set(key, value);
      }
    }
  }
  return new Response(response.body, { ...response, headers });
}

export const onRequest = sequence(addHeaders);
