MathJax = {
  options: {
    enableMenu: false,
  },
  loader: { load: ["input/tex", "output/svg"] },
  tex: {
    inlineMath: [["$", "$", /\$(?=[^\s\$])/, /(?<=[^\s\$])\$/]],
    displayMath: [["$$", "$$", /^\$\$/, /\$\$$/]],
    processEscapes: false,
  },
  // https://stackoverflow.com/questions/71293258/can-i-configure-mathjax-for-smart-matching/71299860#71299860
  startup: {
    ready() {
      const { FindTeX } = MathJax._.input.tex.FindTeX;
      const { selectOptionsFromKeys } = MathJax._.util.Options;
      class myFindTeX extends FindTeX {
        addPattern(starts, delims, display) {
          let [open, close, start, end] = delims;
          if (start && end) {
            starts.push(start.toString().slice(1).replace(/\/$/, ""));
            this.end[open] = [
              close,
              display,
              this.endPattern(null, end.toString().slice(1).replace(/\/$/, "")),
            ];
          } else {
            super.addPattern(starts, delims, display);
          }
        }
      }
      const options = selectOptionsFromKeys(
        MathJax.config.tex,
        myFindTeX.OPTIONS
      );
      MathJax.config.tex.FindTeX = new myFindTeX(options);
      MathJax.startup.defaultReady();
    },
  },
};
$.getScript("/js/third_party/tex-svg.js");
