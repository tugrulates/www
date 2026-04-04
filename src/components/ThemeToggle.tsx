import { Field, Label, Switch } from "@headlessui/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface Props {
  lightIcon?: React.JSX.Element;
  darkIcon?: React.JSX.Element;
}

interface State {
  theme: string;
}

function toggleTheme(
  state: State,
  setState: Dispatch<SetStateAction<State>>,
): void {
  const toggled = { theme: state.theme === "dark" ? "light" : "dark" };
  setState(toggled);
  localStorage.setItem("theme", JSON.stringify(toggled));
}

export default function ThemeToggle(
  { lightIcon, darkIcon }: Props,
): React.JSX.Element {
  const [state, setState] = useState({ theme: "dark" });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setState({
        theme: document.documentElement.getAttribute("data-theme") ?? "light",
      });
      setIsMounted(true);
      return;
    }
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state]);

  if (!isMounted) return <div className="h-12 w-12"></div>;

  return (
    <Field className="group z-0 h-12 w-12 transition-transform">
      <Label className="sr-only">Switch theme</Label>
      <Switch
        checked={state.theme === "dark"}
        onChange={() => toggleTheme(state, setState)}
        className={[
          "group cursor-pointer h-24 w-24 -translate-x-12 transition-transform duration-1000",
          state.theme === "dark" ? "rotate-180" : "rotate-0",
        ].join(" ")}
      >
        <div className="relative flex flex-col overflow-hidden">
          <div className="h-12 w-12 self-end p-2 group-hover:scale-110">
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
