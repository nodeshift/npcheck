const { error } = require('../lib/result');
const { stringBuilder, success, failure } = require('../lib/format');

module.exports = async (moduleInfo) => {
  const output = stringBuilder('\nChecking if it\'s deprecated on NPM').withPadding(66);
  const isDeprecated = moduleInfo.deprecated === 'this version has been deprecated';

  if (isDeprecated) {
    failure(output.get());
    return error(
      `Package '${moduleInfo.name}' seems to be deprecated on NPM. (https://npmjs.com/package/${moduleInfo.name})`
    );
  }

  success(output.get());
  return null;
};
