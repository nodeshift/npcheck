const yargs = require('yargs');
const cli = require('./cli');

const { argv } = yargs
  .usage('[--options]')
  .option('dev-deps', {
    describe: 'Install also the development dependencies for modules',
    choices: [true, false],
    type: 'boolean',
    default: false
  })
  .option('github-token', {
    describe: 'Custom GitHub token provided to the API for resources',
    type: 'string',
    default: null
  });

const options = {};
options.devDeps = argv.devDeps || false;
options.githubToken = argv.githubToken || null;

cli(options);
