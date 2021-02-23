const { execSync } = require('child_process');

const createStats = require('../helpers/stats');
const { pass, fail } = require('../helpers/logger');

module.exports = (pkg, config, options) => {
  // create local stats
  const stats = createStats();
  // transform info to JSON
  const pkgInfo = JSON.parse(
    execSync(`npm show ${pkg.name} --json`, { encoding: 'utf-8' })
  );

  const deprecationOutput = "\nChecking if it's deprecated on NPM".padEnd(
    66,
    ' '
  );

  // check if package is deprecated
  if (pkgInfo.deprecated === 'this version has been deprecated') {
    stats.errors++;
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
