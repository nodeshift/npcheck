const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

const plugins = [];

const use = (plugin) => plugins.push(plugin);

use(require('./plugins/deprecation'));
// use(require('./plugins/archive'));
// use(require('./plugins/license'));
use(require('./plugins/license-deps'));

async function main () {
// create new context instance
  const context = {
    stats: { errors: 0, warnings: 0 }
  };

  // load npcheck config
  let config;

  try {
    const configData = fs.readFileSync(
      path.resolve(__dirname, '.npcheck.json'),
      { encoding: 'utf-8' }
    );

    config = JSON.parse(configData);
    context.config = config;

    console.log('\n🖖 NPCheck config loaded.');
  } catch (err) {
    console.log(chalk.red.bold(`\n🚫 Error loading config file: ${err}\n`));
    process.exit(1);
  }

  for await (const pkg of config.modules) {
    console.log(
      chalk.bold(
        `\n🧪 ==== Running checks on ${chalk.cyan.bold(
          `${pkg.name}`
        )} package ====`
      )
    );

    // add current pkg name to context
    context.pkg = pkg;

    for await (const plugin of plugins) {
      await plugin(context);
    }
  }

  // print check output
  const { errors, warnings } = context.stats;
  const total = errors + warnings;
  // format strings
  const problemStr = total > 1 ? 'problems' : 'problem';
  const errorStr = errors > 1 ? 'errors' : 'error';
  const warningStr = warnings > 1 ? 'warnings' : 'warning';
  // output
  console.log(
    chalk.bold.red(
      `\n${logSymbols.error} ${total} ${problemStr} (${errors} ${errorStr}, ${warnings} ${warningStr}) \n`
    )
  );

  // if errors or warnings exists, exit unsuccessfully
  if (total > 0) process.exit(1);
}

main();
