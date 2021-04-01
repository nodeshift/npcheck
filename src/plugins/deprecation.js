const { error } = require('../lib/result');
const { stringBuilder, success, failure } = require('../lib/format');

const deprecationPlugin = async (module) => {
  const output = stringBuilder(
    "\nChecking if it's deprecated on NPM"
  ).withPadding(66);

  const isDeprecated = module.deprecated === 'this version has been deprecated';

  if (isDeprecated) {
    failure(output.get());
    return error(
      `Package '${module.name}' seems to be deprecated on NPM. (https://npmjs.com/package/${module.name})`
    );
  }

  success(output.get());
  return null;
};

module.exports = deprecationPlugin;
