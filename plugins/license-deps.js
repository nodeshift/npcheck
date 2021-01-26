const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { execSync } = require('child_process');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const checker = require('license-checker');
const { pass, fail, warn } = require('../lib/logger');

const checkerInitAsync = promisify(checker.init);

module.exports = async (context) => {
  // get stuff from context
  const { pkgInfo, config, stats } = context;

  // creating environment folder
  const envPath = path.resolve(process.cwd(), '.npcheck');
  await mkdirp(envPath);

  // installing npm module
  const npmOutput = execSync(
      `npm install --no-package-lock --prefix ${envPath} ${pkgInfo.name}`,
      {
        encoding: 'utf-8',
        cwd: __dirname
      }
  );

  console.log(chalk.magenta(npmOutput));

  // checking license of dependency tree
  const packageLicenses = await checkerInitAsync({ start: envPath });

  for (const [key, value] of Object.entries(packageLicenses)) {
    // license output
    const output = `Checking license of ${chalk.cyan(key)}`.padEnd(75, ' ');

    if (config.licenses.allow.find((name) => name === value.licenses)) {
      pass(output);
    } else if (
      config.licenses.block.find((name) => name === value.licenses) ||
        !value.licenses
    ) {
      stats.errors++;
      fail(output);
    } else {
      stats.warnings++;
      warn(output);
    }
  }

  // clean up node_modules
  fs.rmdirSync(envPath, { recursive: true });
};
