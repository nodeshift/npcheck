const { createError } = require('../lib/result');
const { stringBuilder, success, failure } = require('../lib/format');

const deprecationPlugin = async (pkg) => {
  const output = stringBuilder(
    "\nChecking if it's deprecated on NPM"
  ).withPadding(66);

  /*
    I do thing just the existence of the (pkg.deprecated) field
    should be enough, but just to be 100% sure the (pkg.deprecated !== '')
    check also has been added.
  */
  const isDeprecated = pkg.deprecated && pkg.deprecated !== '';

  if (isDeprecated) {
    failure(output.get());
    return createError(
      `Package '${pkg.name}' seems to be deprecated on NPM with message "${pkg.deprecated}". (https://npmjs.com/package/${pkg.name})`
    );
  }

  success(output.get());
  return null;
};

module.exports = deprecationPlugin;
