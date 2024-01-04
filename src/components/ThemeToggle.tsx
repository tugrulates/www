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
    console.log("theme", theme);
    if (theme.dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Switch
      checked={theme.dark}
      onChange={() => toggleTheme(theme, setTheme)}
      className={[
        "group relative z-20 inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full border-transparent ring-inset ring-stone-500/50 transition-colors hover:bg-stone-500/10 hover:ring-1 focus-visible:ring-2 focus-visible:ring-white/75",
        isMounted ? "" : "opacity-0",
      ].join(" ")}
    >
      <span className="sr-only">Dark mode</span>
      <span
        aria-hidden="true"
        className={
          "pointer-events-none flex h-8 w-8 translate-x-1 translate-y-1 transform flex-row items-center justify-center rounded-full bg-stone-200 ring-stone-500/50 transition-all group-hover:ring-1 dark:translate-x-11 dark:bg-stone-800"
        }
      >
        <img
          src={theme.dark ? "/icons/theme-dark.svg" : "/icons/theme-light.svg"}
          alt={theme.dark ? "night" : "day"}
          className="h-6 w-6 brightness-0 dark:brightness-100"
        />
      </span>
    </Switch>
  );
}
