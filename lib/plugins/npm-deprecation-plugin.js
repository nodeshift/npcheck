const createStats = require('../helpers/create-stats');
const npmInfo = require('../helpers/npm-info');
const { pass, fail } = require('../utils/logger');

module.exports = (pkg, config, options, cache) => {
  // create local stats
  const stats = createStats();
  // transform info to JSON
  const pkgInfo = npmInfo(pkg.name);

  // write module's npm info to cache (performance)
  cache.pkgInfo = pkgInfo;

  const deprecationOutput = "\nChecking if it's deprecated on NPM".padEnd(
    66,
    ' '
  );

  // check if package is deprecated
  if (pkgInfo.deprecated === 'this version has been deprecated') {
    stats.errors += 1;
    stats.logs.push({
      type: 'error',
      message: `Package "${pkg.name}" seems to be deprecated on NPM. (${pkg.npmLink})`
    });
    fail(deprecationOutput);
  } else {
    pass(deprecationOutput);
  }

  return stats;
};
