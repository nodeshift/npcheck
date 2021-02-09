const { pass, fail, warn } = require('../lib/logger');

module.exports = (context) => {
  // extract info from the context
  const { config, pkgInfo, core } = context;
  // check top level license
  const licenseOutput = '\nChecking top-level license'.padEnd(66, ' ');

  if (config.licenses.allow.find((name) => name === pkgInfo.license)) {
    pass(licenseOutput);
  } else if (
    config.licenses.block.find((name) => name === pkgInfo.license) ||
      !pkgInfo.license
  ) {
    core.errors++;
    core.logs.push({
      type: 'error',
      message: `The module "${pkgInfo.name}" is under the non-acceptable license "${pkgInfo.license}".`
    });
    fail(licenseOutput);
  } else {
    core.warnings++;
    core.logs.push({
      type: 'warning',
      message: `The module "${pkgInfo.name}" is under the yet undetermined license "${pkgInfo.license}". (Manual review needed)`
    });
    warn(licenseOutput);
  }

  console.log(); // empty line
};
