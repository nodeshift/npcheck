#! /usr/bin/env node

const yargs = require('yargs');
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

// Clean npcheck-env directory on uncaughtException and SIGINT (aka Ctrl +C)
process.on('uncaughtException', clean);
process.on('SIGINT', clean);
