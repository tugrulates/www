/**
 * Utility function to process input files concurrently with given function.
 */

import { promises as fs } from "fs";
import path from "path";

/**
 * Transform all files provided through argv with the given function.
 */
export default async function transform(
  files: {
    srcs: string | string[];
    dest: string;
    ext?: string;
  },
  func: (src: string, dest: string) => Promise<string | string[]>
): Promise<void> {
  if (typeof files.srcs === "string") {
    files.srcs = [files.srcs];
  }
  const inputs = files.srcs;
  await fs.mkdir(files.dest, { recursive: true });
  await Promise.all(
    inputs.map(async (src) => {
      const ext = files.ext ?? path.extname(src);
      const dest = path.join(
        files.dest,
        path.basename(src, path.extname(src)).concat(ext)
      );
      let outputs = await func(src, dest);
      if (typeof outputs === "string") {
        outputs = [outputs];
      }
      const longest = Math.max(...inputs.map((src) => src.length));
      if (outputs.length > 0) {
        console.log(`${src.padStart(longest)} => ${outputs[0]}`);
        outputs.slice(1).forEach((output) => {
          console.log(`${"".padStart(longest)}  + ${{ output }}`);
        });
      }
    })
  );
}
