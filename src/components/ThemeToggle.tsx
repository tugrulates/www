import { Component } from "react";
import { Switch } from "@headlessui/react";

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
          "group relative z-20 inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full border-transparent ring-inset ring-stone-500/50 transition-colors hover:bg-stone-500/10 hover:ring-1 focus-visible:ring-2 focus-visible:ring-white/75"
        }
      >
        <span className="sr-only">Dark mode</span>
        <span
          aria-hidden="true"
          className={
            "pointer-events-none flex h-8 w-8 translate-x-1 translate-y-1 transform flex-row items-center justify-center rounded-full bg-stone-200 ring-stone-500/50 transition-all  group-hover:ring-1 dark:translate-x-11 dark:bg-stone-800"
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
