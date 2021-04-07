#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const cli = require('./src/cli');

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

// On uncaughtException we should clean the npcheck-env directory
process.on('uncaughtException', () => {
  const envDirectory = path.resolve(process.cwd(), 'npcheck-env');
  if (fs.existsSync(envDirectory)) {
    fs.rmdirSync(envDirectory, { recursive: true });
  }
});
