const fs = require('fs');
const path = require('path');
const util = require('util');
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

const deprecationPlugin = require('./plugins/deprecation');
const archivePlugin = require('./plugins/archive');
const licensePlugin = require('./plugins/license');
const licenseTreePlugin = require('./plugins/licenseTree');
const testsPlugin = require('./plugins/tests');

const { getInfoFromNPM } = require('./lib/npm');
const { merge } = require('./lib/result');

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

    let result = [];

    const plugins = [
      deprecationPlugin,
      archivePlugin,
      licensePlugin,
      licenseTreePlugin,
      testsPlugin
    ];

    for await (const module of config.modules) {
      const nameFormat = chalk.cyan.bold(module.name);
      console.log(chalk.bold(`\nRunning checks on ${nameFormat}`));

      const moduleInfo = getInfoFromNPM(module.name);

      for await (const plugin of plugins) {
        const status = await plugin(moduleInfo, config, options);
        result = merge(result, status);
      }
    }

    console.log(chalk.white.bold('\nNPCheck Report'));

    result.forEach((log, index) => {
      if (log.type === 'error') {
        console.log(chalk.red(`\n(${index + 1}): ${log.reason}`));
      } else {
        console.log(chalk.yellow(`\n(${index + 1}): ${log.reason}`));
      }
    });

    const errors = result.filter((log) => log.type === 'error');
    const warnings = result.filter((log) => log.type === 'warning');

    console.log(
      chalk.red.bold(
        `\nproblems: ${result.length} (errors: ${errors.length} - warnings: ${warnings.length})\n`
      )
    );

    // If we have errors signal to the CI that something is wrong
    if (errors.length > 0) process.exit(1);
  }
};
