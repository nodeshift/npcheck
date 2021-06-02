#! /usr/bin/env node

const yargs = require('yargs');
const chalk = require('chalk');
const cli = require('./src/cli');
const { cleanEnvDirectory } = require('./src/lib/npcheck-env');

const options = yargs
  .parserConfiguration({
    'boolean-negation': false
  })
  .usage('Usage: npcheck [options]')
  .option('github-token', {
    description: 'Custom GitHub token provided to the API for resources',
    type: 'string',
    default: null
  })
  .option('no-errors', {
    description: 'Treats every error as a warning',
    type: 'boolean',
    default: false
  }).argv;

options.githubToken = options['github-token'] || process.env.GITHUB_TOKEN;
options.noErrors = options['no-errors'] || false;

cli.run(options);

// output error stack trace on uncaughtException and unhandledRejection
process.on('uncaughtException', (err) => {
  console.log(chalk.red.bold(err.stack));
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log(chalk.red.bold(err.stack));
  process.exit(1);
});

// clean-up hook before exiting the node.js process
process.on('exit', cleanEnvDirectory);
process.on('SIGINT', cleanEnvDirectory);
