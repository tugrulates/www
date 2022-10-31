/**
 * Copies cover photos from docs repo and makes web ready.
 */

import transform from "./transform.js";

import gm from "gm";
import util from "util";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const ARGV = yargs(hideBin(process.argv))
  .usage("$0 FILES... --ext=FMT [--output=DIR]")
  .string("_")
  .array("_")
  .options({
    ext: { desc: "Image format", type: "string" },
    output: { desc: "Output folder", type: "string", default: "." },
  })
  .parseSync();

/**
 * Process cover files for posts.
 */
void transform(
  { srcs: ARGV._, dest: ARGV.output, ext: ARGV.ext },
  async (src: string, dest: string) => {
    const input = gm(src).noProfile().colorspace("Rec709Luma").resize(3200);
    await util.promisify(input.write).bind(input)(dest);
    return dest;
  }
);
