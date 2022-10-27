/**
 * Copies cover photos from docs repo and makes web ready.
 */

import transform from "./transform.js";

import { FaviconOptions, favicons } from "favicons";
import { promises as fs } from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const ARGV = yargs(hideBin(process.argv))
  .usage("$0 FILE --html=FILE [--output=DIR]")
  .string("_")
  .options({
    html: { desc: "Generated HTML", type: "string", require: true },
    output: { desc: "Output folder", type: "string", default: "." },
  })
  .parseSync();

const OPTIONS: FaviconOptions = {
  appName: "tugrul.blog",
  background: "#2b2622",
};

interface Pass {
  platform: string[];
  output: string[];
}
const PASSES: Pass[] = [
  { platform: ["android"], output: ["images"] },
  { platform: ["appleIcon"], output: ["images"] },
  { platform: ["favicons"], output: ["images"] },
  { platform: ["windows"], output: ["images"] },
  { platform: ["yandex"], output: ["images"] },
  {
    platform: ["android", "appleIcon", "favicons", "windows", "yandex"],
    output: ["files", "html"],
  },
];

/**
 * Process cover files for posts.
 */
void transform(
  { srcs: ARGV._, dest: ARGV.output },
  async (src: string, dest: string) =>
    await Promise.all(
      PASSES.map(async (pass) => {
        // Construct options for this pass.
        const options = {
          ...OPTIONS,
          ...{
            icons: {
              android: false,
              appleIcon: false,
              favicons: false,
              windows: false,
              yandex: false,
              appleStartup: false,
            },
          },
          ...{
            output: {
              images: false,
              files: false,
              html: false,
            },
          },
        };
        pass.platform.forEach((platform) => {
          options.icons[platform] = true;
        });
        pass.output.forEach((output) => {
          options.output[output] = true;
        });

        // Generate favicon.
        const response = await favicons(src, options);

        const outputs: string[] = [];

        // Write images.
        await Promise.all(
          response.images.map(async (image) => {
            const output = path.join(ARGV.output, image.name);
            outputs.push(output);
            return await fs.writeFile(output, image.contents);
          })
        );

        // Write files.
        await Promise.all(
          response.files.map(async (file) => {
            const output = path.join(ARGV.output, file.name);
            outputs.push(output);
            return await fs.writeFile(output, file.contents);
          })
        );

        // Write HTML.
        if (response.html.length > 0) {
          await fs.writeFile(ARGV.html, response.html.join("\n"));
          outputs.push(ARGV.html);
        }

        return outputs;
      })
    ).then((outputs) => outputs.flat())
);
