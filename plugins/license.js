const { pass, fail, warn } = require('../lib/logger');

module.exports = (context) => {
  // extract info from the context
  const { config, pkgInfo, stats } = context;
  // check top level license
  const licenseOutput = '\nChecking top-level license'.padEnd(66, ' ');

  if (config.licenses.allow.find((name) => name === pkgInfo.license)) {
    pass(licenseOutput);
  } else if (
    config.licenses.block.find((name) => name === pkgInfo.license) ||
      !pkgInfo.license
  ) {
    stats.errors++;
    fail(licenseOutput);
  } else {
    stats.warnings++;
    warn(licenseOutput);
  }

  console.log(); // empty line
};
