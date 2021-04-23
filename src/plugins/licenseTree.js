const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const checker = require('license-checker');

const { buildInstallCommand } = require('../lib/npm');
const { stringBuilder, success, warning, failure } = require('../lib/format');
const { error, passThroughError } = require('../lib/result');
const { matchLicenses } = require('../lib/regex');

const checkerAsync = util.promisify(checker.init);

const licenseTreePlugin = async (module, config) => {
  const envFolderPath = path.resolve(process.cwd(), 'npcheck-env');
  fs.mkdirSync(envFolderPath);

  console.log(chalk.gray('\nDownloading module dependencies...'));

  const npmCommand = buildInstallCommand(module.name, envFolderPath);
  const npmOutput = await execSync(npmCommand, {
    encoding: 'utf-8',
    cwd: __dirname
  });

  console.log(chalk.magenta(`\n${npmOutput}`));

  // Run license checker on npcheck-env directory
  const depLicenses = await checkerAsync({ start: envFolderPath });

  // Remove module from the list
  const dependencies = Object.entries(depLicenses).filter(
    ([pkg]) => !pkg.includes(module.name)
  );

  const results = [];

  for (const [key, value] of dependencies) {
    // Creating license list
    const output = stringBuilder(
      `Checking license of ${chalk.cyan(key)}`
    ).withPadding(75);

    const licenses = config.licenses?.allow || [];
    const licensesSpecific = config.licenses?.rules[module.name]?.allow || [];

    const isPassing = [...licenses, ...licensesSpecific].find((name) =>
      matchLicenses(value, name)
    );

    if (isPassing) {
      success(output.get());
      continue;
    }

    // Creating license list for the specific module
    const licenseOverrides =
      config.licenses?.rules[module.name]?.override || [];

    const isForcePassing = licenseOverrides.find((name) =>
      matchLicenses(value, name)
    );

    if (isForcePassing) {
      warning(output.get());
      results.push(
        passThroughError(
          `The module "${module.name}" depends on the "${key}" package which is under the yet undetermined license "${value.licenses}". (Manual review needed)`
        )
      );
      continue;
    }

    // Nothing is accepted treat license as an error
    failure(output.get());
    results.push(
      error(
        `The module "${module.name}" depends on the "${key}" package which is under the non-acceptable license "${value.licenses}".`
      )
    );
  }

  fs.rmdirSync(envFolderPath, { recursive: true });
  return results;
};

module.exports = licenseTreePlugin;
