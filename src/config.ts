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

export const HEADERS = [
  // CSP headers
  {
    source: /\/(.*)/,
    headers: {
      "Content-Security-Policy":
        "default-src 'none'; connect-src 'self' https://vercel.live https://*.pusher.com wss://*.pusher.com; font-src 'self' https://vercel.live https://*.vercel.com https://fonts.gstatic.com; frame-src 'self' https://vercel.live https://www.youtube-nocookie.com; img-src 'self' data: https://vercel.com https://i.ytimg.com; manifest-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline' https://vercel.live; base-uri 'none'; form-action 'none'; frame-ancestors 'none';",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security":
        "max-age=31536001; includeSubDomains; preload",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  },
  // Cache headers
  {
    source: /\/_astro\/(.*)/,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
];
