function initializeGraph() {
  const hue = $("html").css("--hue");
  const light = $("html").css("--light");

  const positive = light > 0.5 ? 80 : 20;
  const negative = 100 - positive;

  const textColor = `hsl(0, 0%, ${negative}%)`;
  const lineColor = `hsl(${hue}, 80%, ${66 - 33 * light}%)`;
  const primaryColor = `hsla(${hue}, 80%, ${20 + 60 * light}%)`;
  const backgroundColor = `hsl(${hue}, 40%, ${20 + 60 * light}%)`;
  const highlightColor = `hsla(${hue}, 40%, 50%, 0.15)`;
  const none = "transparent";

  var config = {
    startOnLoad: true,
    theme: "base",
    themeVariables: {
      primaryColor: primaryColor,
      lineColor: lineColor,
      textColor: textColor,
      titleColor: textColor,
      nodeTextColor: textColor,
      mainBkg: backgroundColor,
      nodeBorder: textColor,
      clusterBkg: highlightColor,
      edgeLabelBackground: backgroundColor,
      clusterBorder: none,
    },
  };
  mermaid.initialize(config);
  mermaid.init(undefined, "code.language-mermaid span");
}

$(document).ready(function () {
  $.getScript("/js/third_party/mermaid.min.js", initializeGraph);
});
