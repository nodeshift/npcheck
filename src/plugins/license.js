const { stringBuilder, success, failure, warning } = require('../lib/format');
const { error, passThroughError } = require('../lib/result');
const { matchLicenses } = require('../lib/regex');

const licensePlugin = async (module, config) => {
  // Licenses that we'll consider passing
  const licenses = config.licenses?.allow || [];
  const licensesLocal = config.licenses?.rules[module.name]?.allow || [];

  // Licenses that will pass but with a warning
  const licensesForcePass = config.licenses?.rules[module.name]?.override || [];

  const isPassing = [...licenses, ...licensesLocal].find((name) =>
    matchLicenses(module.license, name)
  );

  const output = stringBuilder('\nChecking top-level license').withPadding(66);

  if (isPassing) {
    success(output.get());
    return null;
  }

  const isForcePassing = licensesForcePass.find((name) =>
    matchLicenses(module.license, name)
  );

  if (isForcePassing) {
    warning(output.get());
    return passThroughError(
      `The module "${module.name}" is under the the yet undetermined license "${module.license}". (Manual review needed)`
    );
  }

  failure(output.get());
  return error(
    `The module "${module.name}" is under the non-acceptable license "${module.license}".`
  );
};

module.exports = licensePlugin;
