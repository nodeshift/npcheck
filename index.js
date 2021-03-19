#! /usr/bin/env node

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

options.githubToken =
options['github-token'] || process.env.GITHUB_TOKEN || null;

cli.run(options);
