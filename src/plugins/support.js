const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const semver = require('semver');
const pkgSupport = require('@pkgjs/support');

const { stringBuilder, warning, success } = require('../lib/format');
const { buildInstallCommand } = require('../lib/npm');
const { passThroughError } = require('../lib/result');

const supportPlugin = async (pkg, config) => {
  // Support plugin output
  const output = stringBuilder('\nChecking for LTS support').withPadding(66);

  /* DOWNLOAD THE PACKAGE FROM NPM */
  const envFolderPath = path.resolve(process.cwd(), 'npcheck-env');
  fs.mkdirSync(envFolderPath);

  console.log(chalk.gray('\nDownloading module dependencies...'));
  const npmCommand = buildInstallCommand(pkg.name, envFolderPath);

  execSync(npmCommand, { encoding: 'utf-8', cwd: __dirname });
  /* END */

  const pkgPath = path.resolve(
    process.cwd(),
    `npcheck-env/node_modules/${pkg.name}`
  );

  const support = await pkgSupport.getSupportData(pkg, pkgPath);

  const supportData = Buffer.isBuffer(support.contents)
    ? JSON.parse(support.contents.toString())
    : support.contents;

  if (supportData !== 'unknown') {
    // Check for LTS node target
    const targetsLTS = supportData.versions?.find(
      (item) => item?.target?.node === 'lts'
    );
    if (targetsLTS) {
      success(output.get());
      return null;
    }
  }

  /* Couldn't detect LTS support from @pkg/support so let's try the engines field. */

  const NODE_LTS = semver.coerce(config.lts);

  const engines = pkg?.engines?.node || '0.0.0';

  if (semver.satisfies(NODE_LTS, engines)) {
    success(output.get());
    return null;
  }

  // LTS support not found :(
  warning(output.get());
  return passThroughError(
    `The module "${module.name}" appears to have no support for the LTS version (v${NODE_LTS}) of node.`
  );
};

module.exports = supportPlugin;
