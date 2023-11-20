import { Component, type ReactNode } from "react";
import { Popover, RadioGroup, Switch, Transition } from "@headlessui/react";

interface Props {}

interface State {
  dark: boolean;
}

export default class ThemeToggle extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dark: false,
    };
  }

  componentDidMount() {
    try {
      var theme = JSON.parse(localStorage.getItem("theme") ?? "");
    } catch (e) {
      var theme = null;
    }
    if (theme !== null) {
      this.setState(theme);
    } else {
      this.setState({
        dark: document.documentElement.classList.contains("dark"),
      });
    }
  }

  componentDidUpdate() {
    const { dark } = this.state;
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  toggleTheme = () => {
    const newState = { dark: !this.state.dark };
    this.setState(newState);
    localStorage.setItem("theme", JSON.stringify(newState));
  };

  render() {
    return (
      <Switch
        checked={this.state.dark}
        onChange={this.toggleTheme}
        className={
          "shadow-inner-lg group relative z-20 inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-stone-500/50 shadow-inner transition-colors duration-200 ease-in-out hover:bg-stone-500/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        }
      >
        <span className="sr-only">Dark mode</span>
        <span
          aria-hidden="true"
          className={
            "pointer-events-none flex h-9 w-9 translate-x-0 transform flex-row items-center justify-center rounded-full bg-stone-100 shadow ring-0 transition-all ease-in-out  dark:translate-x-10 dark:bg-stone-900 dark:brightness-100 "
          }
        >
          <img
            src={
              this.state.dark
                ? "/icons/theme-darker.svg"
                : "/icons/theme-dark.svg"
            }
            alt={this.state.dark ? "night" : "day"}
            className="h-6 w-6 brightness-0 dark:brightness-100"
          />
        </span>
      </Switch>
    );
  }
}
