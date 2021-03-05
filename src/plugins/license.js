const { stringBuilder, success, failure } = require('../lib/format');
const { error } = require('../lib/result');

module.exports = async (module, config) => {
  const output = stringBuilder('\nChecking top-level license').withPadding(66);
  const licenses = config?.licenses?.allow || [];

  const isLicenseAllowed = licenses.find((name) => name === module?.license);

  if (!isLicenseAllowed) {
    failure(output.get());
    return error(`The module "${module.name}" is under the non-acceptable license "${module.license}".`);
  }

  success(output.get());
  return null;
};
