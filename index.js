const fs = require('fs');
const path = require('path');
const axios = require('axios');
const checker = require('license-checker');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const mkdirp = require('mkdirp');
const { execSync } = require('child_process');
const { promisify } = require('util');

const { pass, fail, warn } = require('./lib/logger');

const checkerInitAsync = promisify(checker.init);

const main = async () => {
  const stats = { errors: 0, warnings: 0 };
  let config;
  // load orion config
  try {
    const configData = fs.readFileSync(
      path.resolve(__dirname, '.orionrc.json'),
      { encoding: 'utf-8' }
    );

    config = JSON.parse(configData);
    console.log('\n🖖 Orion config loaded.');
  } catch (err) {
    console.log(chalk.red.bold(`\n🚫 Error loading config file: ${err}\n`));
    process.exit(1);
  }

  for (const pkg of config.modules) {
    console.log(
      chalk.bold(
        `\n🧪 ==== Running checks on ${chalk.cyan.bold(
          `${pkg.name}`
        )} package ====`
      )
    );

    // transform info to JSON
    const pkgInfo = JSON.parse(
      execSync(`npm show ${pkg.name} --json`, { encoding: 'utf-8' })
    );

    const deprecationOutput = "\nChecking if it's deprecated on NPM".padEnd(
      66,
      ' '
    );

    // check if package is deprecated
    if (pkgInfo.deprecated === 'this version has been deprecated') {
      stats.errors++;
      fail(deprecationOutput);
    } else {
      pass(deprecationOutput);
    }

    const githubTarget = pkgInfo.repository.url
      .split('github.com/')[1]
      .replace('.git', '');

    const { data } = await axios.get(
      `https://api.github.com/repos/${githubTarget}`
    );

    // check if package's repo is archived
    const archiveOutput = 'Checking if github repository is archived'.padEnd(
      65,
      ' '
    );

    if (data.archived) {
      stats.errors++;
      fail(archiveOutput);
    } else {
      pass(archiveOutput);
    }

    // check top level license
    const licenseOutput = '\nChecking top-level license'.padEnd(66, ' ');

    if (config.licenses.allow.find((name) => name === pkgInfo.license)) {
      pass(licenseOutput);
    } else if (
      config.licenses.block.find((name) => name === pkgInfo.license) ||
      !pkgInfo.license
    ) {
      stats.errors++;
      fail(licenseOutput);
    } else {
      stats.warnings++;
      warn(licenseOutput);
    }

    console.log(); // empty line

    // creating environment folder
    await mkdirp(path.resolve(__dirname, '.orion_env'));

    // installing npm module
    const npmOutput = execSync(
      `npm install --no-package-lock --prefix .orion_env ${pkg.name}`,
      {
        encoding: 'utf-8',
        cwd: __dirname
      }
    );

    console.log(chalk.magenta(npmOutput));

    // checking license of dependency tree
    const packageLicenses = await checkerInitAsync({ start: '.orion_env' });

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
    fs.rmdirSync(path.resolve(__dirname, '.orion_env', 'node_modules'), {
      recursive: true
    });
  }
  // remove .orion_env directory
  fs.rmdirSync('.orion_env');

  // print check output
  const { errors, warnings } = stats;
  const total = errors + warnings;
  // format strings
  const problemStr = total > 1 ? 'problems' : 'problem';
  const errorStr = errors > 1 ? 'errors' : 'error';
  const warningStr = warnings > 1 ? 'warnings' : 'warning';
  // output
  console.log(
    chalk.bold.red(
      `\n${logSymbols.error} ${total} ${problemStr} (${errors} ${errorStr}, ${warnings} ${warningStr}) \n`
    )
  );

  // if errors or warnings exists, exit unsuccessfully
  if (total > 0) process.exit(1);
};

main();
