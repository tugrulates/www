
$(document).ready(function () {
    var theme = localStorage.getItem("theme");
    if (!theme) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            theme = "dark";
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            theme = "light";
        }
    }
    if (!theme) {
        // I care for your eyes.
        theme = "dark";
    }
    document.documentElement.setAttribute("data-theme", theme);
});

function getTheme() {
    return document.documentElement.getAttribute("data-theme");
};

function changeTheme() {
    var theme = getTheme();
    theme = (theme === "dark") ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme);
    // TODO: #13 Switch graph theme with page
    // if (window.mermaid !== null) {
    //     window.initializeMermaid();
    // }
};
