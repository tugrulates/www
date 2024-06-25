import { Field, Label, Switch } from "@headlessui/react";
import { useEffect, useState } from "react";

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
    <Field className="group h-12 w-12 transition-transform ">
      <Label className="sr-only">Switch theme</Label>
      <Switch
        checked={theme.dark}
        onChange={() => {
          toggleTheme(theme, setTheme);
        }}
      >
        <div
          className={[
            "relative z-0 flex h-24 w-24 -translate-x-12 flex-col overflow-hidden  transition-transform duration-1000",
            theme.dark ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          <div className=" h-12 w-12 self-end p-2 group-hover:scale-110">
            {lightIcon}
          </div>
          <div className="h-12 w-12 rotate-180 p-2 group-hover:scale-110">
            {darkIcon}
          </div>
        </div>
      </Switch>
    </Field>
  );
}
