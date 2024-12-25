export const SITE = {
  title: "Tugrul Ates",
  description: "Personal website.",
  url: new URL("https://www.tugrulates.com"),
} as const;

export const AUTHOR = {
  name: "Tugrul Ates",
  social: [
    {
      name: "LinkedIn",
      icon: "simple-icons:linkedin",
      url: "https://www.linkedin.com/in/tugrulates/",
    },
    {
      name: "GitHub",
      icon: "simple-icons:github",
      url: "https://github.com/tugrulates",
    },
    {
      name: "Stack Overflow",
      icon: "simple-icons:stackoverflow",
      url: "https://stackoverflow.com/users/634336/tugrul-ates",
    },
    {
      name: "Bluesky",
      icon: "simple-icons:bluesky",
      url: "https://bsky.app/profile/turul.bsky.social",
    },
    {
      name: "500px",
      icon: "logo-500px",
      url: "https://500px.com/p/tugrulates",
    },
    {
      name: "Instagram",
      icon: "simple-icons:instagram",
      url: "https://www.instagram.com/turulier/",
    },
  ],
} as const;

export const DIMENSIONS = {
  cover: {
    wide: {
      width: 736,
      height: 414,
    },
    square: {
      width: 640,
      height: 640,
    },
  },
  opengraph: {
    width: 1200,
    height: 675,
  },
} as const;

export const SSR_FILES = [
  "src/images/me-small.png",
  "node_modules/@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff",
  "node_modules/@fontsource/fira-sans/files/fira-sans-latin-900-normal.woff",
];
