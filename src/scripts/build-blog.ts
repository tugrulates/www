import fs from "fs/promises";

const BLOG_FILES_DIR = "src/blog/files";
const PUBLIC_FILES_DIR = "public/files";

await Promise.all([
  fs.cp(BLOG_FILES_DIR, PUBLIC_FILES_DIR, {
    recursive: true,
  }),
]);
