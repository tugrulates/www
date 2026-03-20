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
      sans: [
        "var(--font-fira-sans)",
        ...defaultTheme.fontFamily.sans,
        "var(--font-cc-symbols)",
      ],
      mono: [
        "var(--font-fira-code)",
        ...defaultTheme.fontFamily.mono,
        "var(--font-cc-symbols)",
      ],
    },
  },
  plugins: [typography],
} satisfies Config;
