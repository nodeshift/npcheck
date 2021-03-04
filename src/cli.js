const fs = require('fs');
const path = require('path');
const util = require('util');
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

const deprecationPlugin = require('./plugins/deprecation');
const archivePlugin = require('./plugins/archive');
const { getInfoFromNPM } = require('./lib/npm');
const { merge } = require('./lib/result');

const figletPromise = util.promisify(figlet);

module.exports = {
  run: async (options) => {
    clear();

    const asciiText = await figletPromise('NPCheck CLI', { font: 'Standard', width: 80 });
    console.log(asciiText);

    let config;
    const configPath = path.resolve(process.cwd(), 'npcheck.json');

    try {
      const configRaw = fs.readFileSync(configPath, { encoding: 'utf-8' });
      config = JSON.parse(configRaw);
    } catch (err) {
      console.log(chalk.red.bold(`Couldn't load configuration file: ${err}`));
      process.exit(1);
    }

    let result = [];
    const plugins = [deprecationPlugin, archivePlugin];

    for await (const module of config.modules) {
      const nameFormat = chalk.cyan.bold(module.name);
      console.log(chalk.bold(`\nRunning checks on ${nameFormat}`));

      const moduleInfo = getInfoFromNPM(module.name);

      for await (const plugin of plugins) {
        const status = await plugin(moduleInfo);
        result = merge(result, status);
      }
    }

    console.log(result);
  }
};
