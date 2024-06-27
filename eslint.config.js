import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import ts from "typescript-eslint";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
  ...astro.configs.all,
  {
    ignores: ["dist", ".astro", ".vercel"],
  },
);
