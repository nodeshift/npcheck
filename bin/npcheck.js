const yargs = require('yargs');
const cli = require('./cli');

const { argv } = yargs
  .usage('[--options]')
  .command(['run', '$0'], 'Starts check runner on modules', { cmd: { default: 'run' } })
  .command('init', 'Create a configuration file', { cmd: { default: 'init' } })
  .command('add', 'Add new module to config', { cmd: { default: 'add' } })
  .option('github-token', {
    describe: 'Custom GitHub token provided to the API for resources',
    type: 'string',
    default: null
  });

const options = {};
options.cmd = argv.cmd;
options.githubToken = argv.githubToken;

cli(options);
