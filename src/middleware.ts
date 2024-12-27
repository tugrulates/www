import { HEADERS } from "~/config.ts";
import { defineMiddleware, sequence } from "~/middleware.astro";

const addHeaders = defineMiddleware(async (context, next) => {
  const response = await next();
  const path = new URL(context.url).pathname;
  for (const headers of HEADERS.filter((h) => h.source.test(path))) {
    for (const [key, value] of Object.entries(headers.headers)) {
      response.headers.set(key, value);
    }
  }
  return response;
});

export const onRequest = sequence(addHeaders);
