const path = require('path');
const semver = require('semver');
const pkgSupport = require('@pkgjs/support');
const nv = require('@pkgjs/nv');

const { stringBuilder, warning, success } = require('../lib/format');
const { passThroughError } = require('../lib/result');

const supportPlugin = async (pkg) => {
  // Support plugin output
  const output = stringBuilder('\nChecking for LTS support').withPadding(66);

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

  const versions = await nv('lts');
  const engines = pkg?.engines?.node || '0.0.0';

  const unsupported = versions
    .map((v) => v.version)
    .filter((v) => !semver.satisfies(v, engines));

  if (unsupported.length === 0) {
    success(output.get());
    return null;
  }

  // LTS support not found :(
  const unsupportedVersions = unsupported.join(', ');
  warning(output.get());
  return passThroughError(
    `The module "${pkg.name}" appears to have no support for the LTS version(s) ${unsupportedVersions} of Node.js.`
  );
};

module.exports = supportPlugin;
