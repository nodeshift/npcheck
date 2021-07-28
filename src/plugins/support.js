const path = require('path');
const semver = require('semver');
const pkgSupport = require('@pkgjs/support');
const nv = require('@pkgjs/nv');

const { stringBuilder, warning, success } = require('../lib/format');
const { createWarning } = require('../lib/result');

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

  const targets = ['all', 'lts', 'active', 'lts_active', 'supported'];

  if (supportData !== 'unknown') {
    // Check for LTS node target
    const targetsLTS = supportData.versions
      .map((version) => version?.target?.node)
      .some((target) => targets.includes(target));

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
  return createWarning(
    supportData === 'unknown' && engines === '0.0.0'
      ? `The module "${pkg.name}" does not specify the engines filed or package-support.json so we cannot determine if it supports the LTS versions of Node.js.`
      : `The module "${pkg.name}" has no support for the LTS version(s) ${unsupportedVersions} of Node.js.`
  );
};

module.exports = supportPlugin;
