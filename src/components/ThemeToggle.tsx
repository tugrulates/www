import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";

interface Props {
  lightIcon?: any;
  darkIcon?: any;
}

interface State {
  dark: boolean;
}

function toggleTheme(theme: State, setTheme: any): void {
  const newTheme = { dark: !theme.dark };
  setTheme(newTheme);
  localStorage.setItem("theme", JSON.stringify(newTheme));
}

export default function ThemeToggle({
  lightIcon,
  darkIcon,
}: Props): JSX.Element {
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
    <Switch.Group>
      <Switch.Label className="hidden">Theme</Switch.Label>
      <Switch
        checked={theme.dark}
        onChange={() => {
          toggleTheme(theme, setTheme);
        }}
        className="group h-12 w-12 transition-transform hover:scale-110"
      >
        <div
          className={[
            "relative z-0 h-24 w-24 -translate-x-14 translate-y-2 transition-transform duration-1000",
            theme.dark ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          <div className="p-l-12 absolute right-0 top-0 h-8 w-8">
            {lightIcon}
          </div>
          <div className="absolute bottom-0 left-0 h-8 w-8 rotate-180">
            {darkIcon}
          </div>
        </div>
      </Switch>
    </Switch.Group>
  );
}
