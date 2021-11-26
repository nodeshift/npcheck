const fs = require('fs');
const path = require('path');
const util = require('util');
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

const deprecationPlugin = require('./plugins/deprecation');
const archivePlugin = require('./plugins/archive');
const citgmPlugin = require('./plugins/citgm');
const licensePlugin = require('./plugins/license');
const licenseTreePlugin = require('./plugins/licenseTree');
const testsPlugin = require('./plugins/tests');
const maintenancePlugin = require('./plugins/maintenance');
const supportPlugin = require('./plugins/support');
const typingsPlugin = require('./plugins/typings');
const auditPlugin = require('./plugins/audit');
const resolvedPlugin = require('./plugins/resolved');

const { getInfoFromNPM } = require('./lib/npm');
const { merge, createError } = require('./lib/result');
const { createErrorLog } = require('./lib/format');
const { createEnvDirectory, cleanEnvDirectory } = require('./lib/npcheck-env');

const figletPromise = util.promisify(figlet);

module.exports = {
  run: async (options) => {
    clear();

    const asciiText = await figletPromise('NPCheck CLI', {
      font: 'Standard',
      width: 80
    });
    console.log(asciiText);

    let config;
    const configPath = path.resolve(process.cwd(), 'npcheck.json');

    try {
      const configRaw = fs.readFileSync(configPath, { encoding: 'utf-8' });
      config = JSON.parse(configRaw);
    } catch (err) {
      console.log(chalk.red.bold(`Couldn't load configuration file: ${err}`));
      process.exit(1);
    }

    let results = [];

    const plugins = [
      deprecationPlugin,
      archivePlugin,
      licensePlugin,
      licenseTreePlugin,
      testsPlugin,
      maintenancePlugin,
      supportPlugin,
      typingsPlugin,
      citgmPlugin,
      auditPlugin,
      resolvedPlugin
    ];

    for (const pkg of config.modules) {
      // just some info output
      const pkgNamePretty = chalk.cyan.bold(pkg.name);
      console.log(chalk.bold(`\nRunning checks on ${pkgNamePretty}`));

      const pkgInfo = getInfoFromNPM(pkg.name);

      // create the env directory for this package
      console.log(chalk.gray('\nDownloading module dependencies...'));

      try {
        createEnvDirectory(pkg);
        console.log(
          chalk.magenta(
            `\n${pkgInfo.name}@${pkgInfo.version} has been installed.`
          )
        );
      } catch (err) {
        // when a module can't be installed using NPM log the output to `npcheck-errors.log`
        console.log(chalk.red.bold(`\nFailed to install ${pkgInfo.name}...`));
        createErrorLog(err.message);

        // update the results array
        const logs = chalk.italic('npcheck-errors.log');
        results = merge(
          results,
          createError(
            `Module "${pkgInfo.name}" couldn't be installed. Check ${logs} for more information.`
          )
        );

        // clean-up env directory from the current package
        cleanEnvDirectory();

        // continue to the next module on the list
        continue;
      }

      for (const plugin of plugins) {
        const status = await plugin(pkgInfo, config, options);
        results = merge(results, status);
      }

      // clean-up env directory from the current package
      cleanEnvDirectory();
    }

    // check if the no-errors flag is set
    results = options.noErrors
      ? results.map(({ type, ...rest }) => ({ type: 'warning', ...rest }))
      : results;

    console.log(chalk.white.bold('\nNPCheck Report'));

    results.forEach((log, index) => {
      if (log.type === 'error') {
        console.log(chalk.red(`(${index + 1}): ${log.reason}`, '- ERROR'));
      } else {
        console.log(chalk.yellow(`(${index + 1}): ${log.reason}`));
      }
    });

    const errors = results.filter((log) => log.type === 'error');
    const warnings = results.filter((log) => log.type === 'warning');

    console.log(
      chalk.red.bold(
        `\nproblems: ${results.length} (errors: ${errors.length} - warnings: ${warnings.length})\n`
      )
    );

    // If we have errors signal to the CI that something is wrong
    if (errors.length > 0) process.exit(1);
  }
};
