module.exports = {
  ci: {
    collect: {
      numberOfRuns: 5,
      settings: {
        skipAudits: [],
      },
    },
    assert: {
      // TODO: #74 Fix all recommended Lighthouse checks
      // preset: "lighthouse:recommended",
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
