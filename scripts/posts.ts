/**
 * Copies markdown files from docs repo and converts for Zola.
 */

import transform from "./transform.js";

import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const ARGV = yargs(hideBin(process.argv))
  .usage("$0 [files...] [--output=DIR]")
  .string("_")
  .array("_")
  .options({
    output: { desc: "Output folder", type: "string", default: "." },
  })
  .parseSync();

const LINKS = {
  wiki: /\[\[(?!\])((.*?))(?<!\[)\]\]/g,
  internal: /\[(?!\])(.*?)(?<!\[)\]\((?!@\/)(.+?)\.md\)/g,
};

type Scripts = Record<string, RegExp>;
const SCRIPTS: Scripts = {
  math: /(\$(?=[^\s]).*(?<=[^\s])\$)|(\$\$.*\$\$)/,
  graph: /^```mermaid/,
};

const DEFAULT_COVER = "/photos/roundest-object-on-earth.jpg";

/**
 * Convert Markdown content to be consumed by Zola.
 */
void transform(
  { srcs: ARGV._, dest: ARGV.output },
  async (src: string, dest: string) => {
    // Generate internal links in Zola's format.
    function linkReplace(_: string, name: string, link: string): string {
      const ext = path.extname(link) === "" ? ".md" : "";
      const dir = path.extname(link) === ".jpg" ? "/photos/" : "@";
      return `[${name}](${dir}/${link.replace(" ", "%20")}${ext})`;
    }

    // Split file into markdown blocks.
    const buffer = await fs.readFile(src);
    const file = matter(buffer);
    let blocks = file.content
      .toString()
      .trim()
      .split("\n\n")
      .map((x) => x.trim());

    // Posts are draft by default.
    file.data.draft = file.data.state !== "public";

    // Generate title from file name.
    file.data.title ??= path.parse(src).name;

    // Mark end of first paragraph to generate summary.
    if (blocks.length > 0) {
      blocks[0] = blocks[0].concat("<!-- more -->");
    }

    // Copy "tags" into "taxonomies.tags".
    // if (file.data.tags) {
    //   file.data.taxonomies = { tags: file.data.tags.split(" ") };
    // }
    // Update internal links.
    blocks = blocks.map((block) =>
      block
        .replace(LINKS.wiki, linkReplace)
        .replace(LINKS.internal, linkReplace)
    );

    // Determine which js to load based on content.
    const postScripts: string[] = [];
    for (const script in SCRIPTS) {
      if (blocks.find((x) => SCRIPTS[script].test(x)) != null) {
        postScripts.push(script);
      }
    }

    // Create extras with defaults.
    file.data.extra = {
      scripts: postScripts,
      cover: file.data.cover ?? DEFAULT_COVER,
    };

    // Reconstruct file.
    file.content = "\n".concat(blocks.join("\n\n"));
    await fs.writeFile(dest, matter.stringify(file.content, file.data));

    return dest;
  }
);
