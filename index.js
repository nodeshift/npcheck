#! /usr/bin/env node

const yargs = require('yargs');
const chalk = require('chalk');
const cli = require('./src/cli');
const clean = require('./src/lib/clean');

const options = yargs
  .usage('Usage: npcheck [--options]')
  .option('github-token', {
    alias: 'gt',
    description: 'Custom GitHub token provided to the API for resources',
    type: 'string',
    default: null
  }).argv;

options.githubToken = options['github-token'] || process.env.GITHUB_TOKEN;

cli.run(options);

// output error stack trace on uncaughtException and unhandledRejection
process.on('uncaughtException', err => {
  console.log(chalk.red.bold(err.stack));
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.log(chalk.red.bold(err.stack));
  process.exit(1);
});

// clean-up hook before exiting the node.js process
process.on('exit', clean);
process.on('SIGINT', clean);
