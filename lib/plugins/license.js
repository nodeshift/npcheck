const { pass, fail, warn } = require('../helpers/logger');
const createStats = require('../helpers/stats');

module.exports = (pkg, config, options) => {
  // get NPM info
  const npmInfo = {};

  // check top level license
  const stats = createStats();
  const licenseOutput = '\nChecking top-level license'.padEnd(66, ' ');

  if (config.licenses.allow.find((name) => name === npmInfo.license)) {
    pass(licenseOutput);
  } else if (
    config.licenses.block.find((name) => name === npmInfo.license) ||
    !npmInfo.license
  ) {
    stats.errors += 1;
    stats.logs.push({
      type: 'error',
      message: `The module "${npmInfo.name}" is under the non-acceptable license "${npmInfo.license}".`
    });
    fail(licenseOutput);
  } else {
    stats.warnings += 1;
    stats.logs.push({
      type: 'warning',
      message: `The module "${npmInfo.name}" is under the yet undetermined license "${npmInfo.license}". (Manual review needed)`
    });
    warn(licenseOutput);
  }

  console.log(); // empty line
  return stats;
};
