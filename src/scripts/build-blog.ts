import path from "path";
import fs from "fs/promises";

const BLOG_DIR = "src/blog";
const CONTENT_DIR = "src/content";

await Promise.all(
  ["files", "posts"].map((directory) =>
    fs.cp(path.join(BLOG_DIR, directory), path.join(CONTENT_DIR, directory), {
      recursive: true,
    }),
  ),
);
