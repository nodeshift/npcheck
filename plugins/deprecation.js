const { execSync } = require('child_process');
const { pass, fail } = require('../lib/logger');

module.exports = (context) => {
  // extract info from the context
  const { pkg, stats } = context;

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
    fail(deprecationOutput);
  } else {
    pass(deprecationOutput);
  }

  // add npm pkgInfo to context
  context.pkgInfo = pkgInfo;
};
