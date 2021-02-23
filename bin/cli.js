const chalk = require('chalk');
const logSymbols = require('log-symbols');
const createRunner = require('../lib/runner');

// import plugins
const npmDeprecationPlugin = require('../lib/plugins/npm-deprecation-plugin');
const githubArchivePlugin = require('../lib/plugins/github-archive-plugin');
const moduleLicensePlugin = require('../lib/plugins/module-license-plugin');
const moduleTreeLicensePlugin = require('../lib/plugins/module-tree-license-plugin');
const appropriateTestingPlugin = require('../lib/plugins/appropriate-testing-plugin');

module.exports = async (options) => {
  try {
    const runner = createRunner(
      options,
      [
        npmDeprecationPlugin,
        githubArchivePlugin,
        moduleLicensePlugin,
        moduleTreeLicensePlugin,
        appropriateTestingPlugin
      ]
    );

    const result = await runner.start();

    result.logs.forEach((log, index) => {
      if (log.type === 'error') {
        console.log(chalk.red(`\n(${index + 1}): ${log.message}`));
      } else {
        console.log(chalk.yellow(`\n(${index + 1}): ${log.message}`));
      }
    });

    // print check output
    const { errors, warnings } = result;
    const total = errors + warnings;

    // format strings
    const problemStr = total === 1 ? 'problem' : 'problems';
    const errorStr = errors === 1 ? 'error' : 'errors';
    const warningStr = warnings === 1 ? 'warning' : 'warnings';

    // output
    console.log(
      chalk.bold.red(
      `\n${logSymbols.error} ${total} ${problemStr} (${errors} ${errorStr}, ${warnings} ${warningStr}) \n`
      )
    );

    // if errors or warnings exists, exit unsuccessfully
    if (errors > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error(err);
  }
};
