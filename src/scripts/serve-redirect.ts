import { SITE } from "../config.ts";

Deno.serve(() => Response.redirect(SITE.url, 308));
