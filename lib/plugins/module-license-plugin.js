const { pass, fail } = require('../utils/logger');
const createStats = require('../helpers/create-stats');
const npmInfo = require('../helpers/npm-info');

module.exports = (pkg, config, options, cache) => {
  // get NPM info
  const pkgInfo = cache.pkgInfo || npmInfo(pkg.name);

  // check top level license
  const stats = createStats();
  const licenseOutput = '\nChecking top-level license'.padEnd(66, ' ');

  const licensePass = config.licenses.allow.find((name) => name === pkgInfo.license);

  if (licensePass) {
    pass(licenseOutput);
  } else {
    stats.errors += 1;
    stats.logs.push({
      type: 'error',
      message: `The module "${pkgInfo.name}" is under the non-acceptable license "${pkgInfo.license}".`
    });
    fail(licenseOutput);
  }

  console.log(); // empty line
  return stats;
};
