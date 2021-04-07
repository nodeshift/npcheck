const { stringBuilder, success, failure } = require('../lib/format');
const { error } = require('../lib/result');

const licensePlugin = async (module, config) => {
  const licenses = config.licenses?.allow || [];
  const isLicenseAllowed = licenses.find((name) => name === module?.license);

  const output = stringBuilder('\nChecking top-level license').withPadding(66);

  if (!isLicenseAllowed) {
    failure(output.get());
    return error(
      `The module "${module.name}" is under the non-acceptable license "${module.license}".`
    );
  }

  success(output.get());
  return null;
};

module.exports = licensePlugin;
