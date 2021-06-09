const { createError } = require('../lib/result');
const { stringBuilder, success, failure } = require('../lib/format');

const deprecationPlugin = async (pkg) => {
  const output = stringBuilder(
    "\nChecking if it's deprecated on NPM"
  ).withPadding(66);

  const isDeprecated = pkg.deprecated === 'this version has been deprecated';

  if (isDeprecated) {
    failure(output.get());
    return createError(
      `Package '${pkg.name}' seems to be deprecated on NPM. (https://npmjs.com/package/${pkg.name})`
    );
  }

  success(output.get());
  return null;
};

module.exports = deprecationPlugin;
