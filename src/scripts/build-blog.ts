import fs from "fs/promises";

const BLOG_POSTS_DIR = "src/blog/posts";
const BLOG_FILES_DIR = "src/blog/files";
const CONTENT_POSTS_DIR = "src/content/posts";
const PUBLIC_FILES_DIR = "public/files";

await Promise.all([
  fs.cp(BLOG_POSTS_DIR, CONTENT_POSTS_DIR, {
    recursive: true,
  }),
  fs.cp(BLOG_FILES_DIR, PUBLIC_FILES_DIR, {
    recursive: true,
  }),
]);
