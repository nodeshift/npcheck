const { fetch } = require('../lib/network');
const { stringBuilder, warning, success } = require('../lib/format');
const { createWarning } = require('../lib/result');

// helper function when parsing @types/<package> list
const unmangle = (name) => {
  return name.replace('__', '/').replace('@', '');
};

const typingsPlugin = async (pkg) => {
  // Typings plugin output
  const output = stringBuilder('\nChecking for TypeScript typings').withPadding(
    66
  );

  // First we'll check if typings are defined in module's package.json file.
  if (pkg.types || pkg.typings) {
    success(output.get());
    return null;
  }

  // Then we'll check Microsoft's @types/<package> list
  const TYPES_URI =
    'https://typespublisher.blob.core.windows.net/typespublisher/data/search-index-min.json';

  const data = await fetch(TYPES_URI);
  const hasTypesPackage = data.find((item) => unmangle(item.t) === pkg.name);

  if (hasTypesPackage) {
    success(output.get());
    return null;
  }

  // It seems that there're no available typescript typings
  warning(output.get());
  return createWarning(
    `The module "${pkg.name}" seems to have no available TypeScript typings.`
  );
};

module.exports = typingsPlugin;

module.exports.unmangle = unmangle; // exporting unmangle util function for testing purposes
