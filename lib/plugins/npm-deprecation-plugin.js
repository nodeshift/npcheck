const createStats = require('../helpers/create-stats');
const { pass, fail } = require('../utils/logger');

module.exports = (pkgInfo, config, options) => {
  // create local stats
  const stats = createStats();

  const deprecationOutput = "\nChecking if it's deprecated on NPM".padEnd(
    66,
    ' '
  );

  // check if package is deprecated
  if (pkgInfo.deprecated === 'this version has been deprecated') {
    stats.errors += 1;
    stats.logs.push({
      type: 'error',
      message: `Package "${pkgInfo.name}" seems to be deprecated on NPM. (${pkgInfo.npmLink})`
    });
    fail(deprecationOutput);
  } else {
    pass(deprecationOutput);
  }

  return stats;
};
