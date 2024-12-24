import { move } from "jsr:@std/fs/move";
import { join } from "jsr:@std/path";

const OUTPUT_DIR = ".vercel/output";
const CONFIG_FILE = "vercel.json";

/**
 * Add Deno runtime to generated functions.
 *
 * This has to be done because functions are not available before build.
 */
async function changeRuntime() {
  const config = JSON.parse(await Deno.readTextFile(CONFIG_FILE));
  config.functions = {
    "dist/server/entry.mjs": { runtime: "vercel-deno@3.1.0" },
  };
  await Deno.writeTextFile(CONFIG_FILE, JSON.stringify(config));
}

/**
 * Move the build output to static.
 *
 * This is only needed when building with Deno. Not sure why.
 */
async function moveBuildOutput() {
  await move(join(OUTPUT_DIR, "static/client"), join(OUTPUT_DIR, "client"));
  await move(join(OUTPUT_DIR, "client"), join(OUTPUT_DIR, "static"), {
    overwrite: true,
  });
}

await moveBuildOutput();
await changeRuntime();
