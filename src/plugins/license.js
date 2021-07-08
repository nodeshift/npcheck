const { stringBuilder, success, failure, warning } = require('../lib/format');
const { createError, createWarning } = require('../lib/result');
const { matchLicenses } = require('../lib/regex');

const licensePlugin = async (pkg, config) => {
  // Licenses that we'll consider passing
  const licenses = config.licenses?.allow || [];
  const licensesLocal = config.licenses?.rules[pkg.name]?.allow || [];

  // Licenses that will pass but with a warning
  const licensesForcePass = config.licenses?.rules[pkg.name]?.override || [];

  // We need to check if the the license is defined as a string or an array
  const license = Array.isArray(pkg.licenses)
    ? pkg.licenses.map((v) => v.type).join(',')
    : pkg.license;

  const isPassing = [...licenses, ...licensesLocal].find((name) =>
    matchLicenses(license, name)
  );

  const output = stringBuilder('\nChecking top-level license').withPadding(66);

  if (isPassing) {
    success(output.get());
    return null;
  }

  const isForcePassing = licensesForcePass.find((name) =>
    matchLicenses(license, name)
  );

  if (isForcePassing) {
    warning(output.get());
    return createWarning(
      `The module "${pkg.name}" is under the yet undetermined license(s) "${license}". (Manual review needed)`
    );
  }

  failure(output.get());
  return createError(
    `The module "${pkg.name}" is under the non-acceptable license(s) "${license}".`
  );
};

module.exports = licensePlugin;
