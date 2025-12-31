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
