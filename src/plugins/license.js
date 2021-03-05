const { stringBuilder, success, failure } = require('../lib/format');
const { error } = require('../lib/result');

module.exports = async (moduleInfo, config) => {
  const output = stringBuilder('\nChecking top-level license').withPadding(66);
  const licenses = config?.licenses?.allow || [];

  const isLicenseAllowed = licenses.find((name) => name === moduleInfo?.license);

  if (!isLicenseAllowed) {
    failure(output.get());
    return error(`The module "${moduleInfo.name}" is under the non-acceptable license "${moduleInfo.license}".`);
  }

  success(output.get());
  return null;
};
