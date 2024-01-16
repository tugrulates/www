import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import { DIMENSIONS } from "./src/consts";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: [
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      serif: [
        "Apple Garamond",
        "Baskerville",
        "Times New Roman",
        "Droid Serif",
        "Times",
        "Source Serif Pro",
        "serif",
      ],
    },
    extend: {
      height: {
        "cover-desktop": `${DIMENSIONS.desktop_cover_height}px`,
        "cover-mobile": `${DIMENSIONS.mobile_cover_size}px`,
      },
      width: {
        "cover-desktop": `${DIMENSIONS.desktop_cover_width}px`,
        "cover-mobile": `${DIMENSIONS.mobile_cover_size}px`,
      },
    },
  },
  plugins: [typography],
} satisfies Config;
