import React, { Component, type ReactNode } from "react";

interface Props {
  darkIcon?: ReactNode;
  lightIcon?: ReactNode;
}

interface State {
    theme: string | null;
}

export default class ThemeToggle extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            theme: 'null',
        };
    }

    componentDidMount() {
        var theme = localStorage.getItem("theme");
        if (!theme) {
            theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
        }
        this.setState({ theme: theme });
    }

    componentDidUpdate() {
        const { theme } = this.state;
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }

    toggleTheme = () => {
        const { theme } = this.state;
        if (!theme) {
            return;
        }
        const newTheme = theme !== "light" ? "light" : "dark"
        localStorage.setItem("theme", newTheme);
        this.setState((_) => ({ theme: newTheme }));
    };

    render() {
        const { theme } = this.state;
        if (!theme) {
            return null;
        }
        return (
            <button onClick={this.toggleTheme} className="p-2 rounded-md hover:bg-stone-300 dark:hover:bg-stone-700 duration-200">
                {theme === "light" ? this.props.lightIcon : this.props.darkIcon}
            </button>
        );
    }
}
