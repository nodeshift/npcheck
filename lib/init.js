const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

module.exports = function handler (options) {
  // resolve full config path location
  const configPath = path.resolve(process.cwd(), '.npcheck.json');
  const configExists = fs.existsSync(configPath);

  // check if a configuration file already exists
  if (configExists) {
    console.log(chalk.red('\n🚫 Configuration file already exists in this directory.\n'));
    return;
  }

  // initial config template
  const config = {
    modules: [],
    licenses: {
      allow: {},
      rules: {}
    }
  };

  // create configuration file and save it to disk
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), { encoding: 'utf-8' });
  console.log(chalk.cyan('\n✨ Configuration file successfully initialized.\n'));
};
