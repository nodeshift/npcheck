const chalk = require('chalk');
const logSymbols = require('log-symbols');
const createRunner = require('../lib/runner');

module.exports = async (options) => {
  try {
    const runner = createRunner(options, null);
    const response = await runner.start();

    response.logs.forEach((log, index) => {
      if (log.type === 'error') {
        console.log(chalk.red(`\n(${index + 1}): ${log.message}`));
      } else {
        console.log(chalk.yellow(`\n(${index + 1}): ${log.message}`));
      }
    });

    // print check output
    const { errors, warnings } = response;
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
