const { execSync } = require('child_process');
const { pass, fail } = require('../lib/logger');

module.exports = (context) => {
  // extract info from the context
  const { pkg, core } = context;

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
    core.errors++;
    core.logs.push({
      type: 'error',
      message: `Package "${pkg.name}" seems to be deprecated on NPM. (${pkg.npmLink})`
    });
    fail(deprecationOutput);
  } else {
    pass(deprecationOutput);
  }

  // add npm pkgInfo to context
  context.pkgInfo = pkgInfo;
};
