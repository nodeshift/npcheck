const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const prompts = require('prompts');

module.exports = async function handler (options) {
  // resolve full config path location
  const configPath = path.resolve(process.cwd(), '.npcheck.json');
  const configExists = fs.existsSync(configPath);

  // check if a configuration file exists in current directory
  if (!configExists) {
    throw Error(
      chalk.red.bold('\n🚫 No configuration file found. Run `npcheck init` to generate it.\n')
    );
  }

  // load config file from disk
  const configFile = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configFile);

  const { module } = await prompts({
    type: 'text',
    name: 'module',
    message: 'What module you want to add?'
  });

  const { npmLink } = await prompts({
    type: 'text',
    name: 'npmLink',
    message: `NPM link for the "${module} module?" `
  });

  if (!module || !npmLink) {
    throw Error(chalk.red.bold('\n🚫 Invalid input. Try again.\n'));
  }

  // check if module is already added to the list
  const moduleExists = config.modules.find(({ name }) => name === module);

  if (moduleExists) {
    throw Error(chalk.red.bold(`\n🚫 Module "${module}" already exists in the config.\n`));
  }

  // create module config item
  const moduleEntity = {
    name: module,
    npmLink
  };

  // write updated config to the disk
  config.modules.push(moduleEntity);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), { encoding: 'utf-8' });

  console.log(
    `\n📦 New package ${chalk.bold.green(module)} added to config.\n`
  );
};
