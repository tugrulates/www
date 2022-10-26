var config = require("./lighthouserc.production.js");
config.ci.collect.settings.skipAudits.push(
  "is-crawlable" // preview deploys are not crawlable by design
);
module.exports = config;
