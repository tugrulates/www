const config = require("./lighthouserc.live.cjs");
config.ci.collect.settings.skipAudits.push(
  "is-crawlable" // preview deploys are not crawlable by design
);
module.exports = config;
