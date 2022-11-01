function css(property, value = null) {
  if (value === null) {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(property);
  }
  document.documentElement.style.setProperty(property, value);
}

function dataTheme(value = null) {
  if (value === null) {
    return document.documentElement.getAttribute("data-theme");
  }
  document.documentElement.setAttribute("data-theme", value);
}

function prefs(pref = null) {
  if (pref === null) {
    try {
      return JSON.parse(localStorage.prefs);
    } catch {
      return {};
    }
  }
  localStorage.prefs = JSON.stringify({ ...prefs(), ...pref });
}

function initializeTheme() {
  // Runs before JQuery is loaded.
  const pref = prefs();
  if (pref.light) {
    css("--light", pref.light);
  }
  if (!pref.hue) {
    randomizeHue();
  } else {
    css("--hue", pref.hue);
  }
  dataTheme(
    pref.theme ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark")
  );
}

function switchLight() {
  const theme = css("--light") > 0.5 ? "dark" : "light";
  dataTheme(theme);
  css("--light", "");
  prefs({ theme: theme, light: null });
  updateLightIcon();
  updateInputs();
  // TODO: #13 Switch graph theme with page
  // if (window.mermaid !== null) {
  //     window.initializeGraph();
  // };
}

function randomizeHue() {
  const hue = Math.floor(Math.random() * 360);
  css("--hue", hue);
  prefs({ hue: hue });
}

function switchHue() {
  randomizeHue();
  updateInputs();
}

function changeLight() {
  const light = $("#light-tune").val();
  const theme = light > 0.5 ? "light" : "dark";
  dataTheme(theme);
  css("--light", light);
  prefs({ light: light, theme: null });
  updateLightIcon();
}

function changeHue() {
  const hue = $("#hue-tune").val();
  css("--hue", hue);
  prefs({ hue: hue });
}

function updateLightIcon() {
  const light = parseFloat(css("--light"));
  const icon =
    light < 0.25
      ? "darker"
      : light < 0.5
      ? "dark"
      : light < 0.75
      ? "lighter"
      : "light";
  $("#light-icon").attr("src", `/icons/theme-${icon}.svg`);
}

function updateInputs() {
  $("#light-tune").val(parseFloat($("html").css("--light")));
  $("#hue-tune").val(parseInt($("html").css("--hue")));
}

function createControl(controls, control) {
  controls.append(
    $(
      `<div class="${control.name} control">
      <label for="${control.name}-tune">change ${control.name}</label>
      <input class="tune" id="${control.name}-tune" type="range"
             min=${control.min} max=${control.max} step=${control.step}>
      <button id="${control.name}-switch" aria-label="${control.aria}">
        <img id="${control.name}-icon" class="icon" src="/icons/theme-${control.name}.svg" alt="${control.aria}">
      </button>
    </div>`
    )
  );
  $(`#${control.name}-switch`).click(function () {
    control.switch();
    if ($(`#${control.name}-switch`).is(":hover")) {
      $(`#${control.name}-switch`).blur();
    }
  });
  $(`#${control.name}-tune`).on("input", control.change);
}

initializeTheme();
document.addEventListener(
  "DOMContentLoaded",
  function () {
    const controls = $("<div class='controls'></div>");
    $(".control-box").append(controls);
    createControl(controls, {
      name: "light",
      aria: "toggle theme",
      switch: switchLight,
      change: changeLight,
      min: 0,
      max: 1,
      step: 0.01,
    });
    createControl(controls, {
      name: "hue",
      aria: "random color",
      switch: switchHue,
      change: changeHue,
      min: 0,
      max: 359,
      step: 1,
    });
    updateInputs();
    updateLightIcon();
  },
  false
);
