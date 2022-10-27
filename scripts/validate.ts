/**
 * Run HTML validator on generated HTML files.
 */

import { w3cHtmlValidator } from "w3c-html-validator";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const ARGV = yargs(hideBin(process.argv))
  .usage("$0 FILE")
  .string("_")
  .array("_")
  .parseSync();

await Promise.all(
  ARGV._.map(async (file) => {
    const options = { filename: file, ignoreLevel: "info" as const };
    await w3cHtmlValidator.validate(options).then(w3cHtmlValidator.reporter);
  })
);
