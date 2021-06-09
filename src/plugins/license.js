const { stringBuilder, success, failure, warning } = require('../lib/format');
const { createError, createWarning } = require('../lib/result');
const { matchLicenses } = require('../lib/regex');

const licensePlugin = async (pkg, config) => {
  // Licenses that we'll consider passing
  const licenses = config.licenses?.allow || [];
  const licensesLocal = config.licenses?.rules[pkg.name]?.allow || [];

  // Licenses that will pass but with a warning
  const licensesForcePass = config.licenses?.rules[pkg.name]?.override || [];

  const isPassing = [...licenses, ...licensesLocal].find((name) =>
    matchLicenses(pkg.license, name)
  );

  const output = stringBuilder('\nChecking top-level license').withPadding(66);

  if (isPassing) {
    success(output.get());
    return null;
  }

  const isForcePassing = licensesForcePass.find((name) =>
    matchLicenses(pkg.license, name)
  );

  if (isForcePassing) {
    warning(output.get());
    return createWarning(
      `The module "${pkg.name}" is under the the yet undetermined license "${pkg.license}". (Manual review needed)`
    );
  }

  failure(output.get());
  return createError(
    `The module "${pkg.name}" is under the non-acceptable license "${pkg.license}".`
  );
};

module.exports = licensePlugin;
