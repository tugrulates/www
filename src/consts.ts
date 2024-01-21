export const SITE = {
  title: "Tugrul Ates",
  description: "Tugrul Ates's personal website",
  url: "https://www.tugrulates.com",
};

function getAge() {
  const now = new Date();
  const birthdate = new Date("1984-01-22");
  const duration = new Date(now.getTime() - birthdate.getTime());
  return {
    year: duration.getFullYear() - 1970,
    month: duration.getMonth(),
    day: duration.getDate(),
  };
}

export const AUTHOR = {
  name: "Tugrul Ates",
  age: getAge(),
  social: [
    {
      name: "LinkedIn",
      icon: "/icons/social-linkedin.svg",
      url: "https://www.linkedin.com/in/tugrulates/",
    },
    {
      name: "GitHub",
      icon: "/icons/social-github.svg",
      url: "https://github.com/tugrulates",
    },
    {
      name: "Stack Overflow",
      icon: "/icons/social-stackoverflow.svg",
      url: "https://stackoverflow.com/users/634336/tugrul-ates",
    },
    {
      name: "YouTube",
      icon: "/icons/social-youtube.svg",
      url: "https://www.youtube.com/@tugrulates.demoscene",
    },
    {
      name: "Instagram",
      icon: "/icons/social-instagram.svg",
      url: "https://www.instagram.com/turulier/",
    },
  ],
};

export const DIMENSIONS = {
  desktop_cover_width: 736,
  desktop_cover_height: 414,
  mobile_cover_size: 640,
};
