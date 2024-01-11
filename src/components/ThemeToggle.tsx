import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";

interface State {
  dark: boolean;
}

function toggleTheme(theme: State, setTheme: any) {
  const newTheme = { dark: !theme.dark };
  setTheme(newTheme);
  localStorage.setItem("theme", JSON.stringify(newTheme));
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState({ dark: true });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setTheme({ dark: document.documentElement.classList.contains("dark") });
      setIsMounted(true);
      return;
    }
    if (theme.dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (!isMounted) return <div className="h-12 w-12"></div>;

  return (
    <Switch
      checked={theme.dark}
      onChange={() => toggleTheme(theme, setTheme)}
      className="group h-12 w-12"
    >
      <div
        className={[
          "relative -z-10 h-24 w-24 -translate-x-14 translate-y-2 transition-transform duration-1000",
          theme.dark ? "rotate-180" : "rotate-0",
        ].join(" ")}
      >
        <img
          src="/icons/theme-light.svg"
          alt="day"
          width={32}
          height={32}
          className="p-l-12 absolute right-0 top-0 brightness-0 dark:brightness-100"
        />
        <img
          src="/icons/theme-dark.svg"
          alt="night"
          width={32}
          height={32}
          className="absolute bottom-0 left-0 rotate-180 brightness-0 dark:brightness-100"
        />
      </div>
    </Switch>
  );
}
