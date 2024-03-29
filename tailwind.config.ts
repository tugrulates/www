import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    fontFamily: {
      sans: ["Fira Sans", ...defaultTheme.fontFamily.sans, "CCSymbols"],
      mono: ["Fira Code", ...defaultTheme.fontFamily.mono, "CCSymbols"],
    },
  },
  plugins: [typography],
} satisfies Config;
