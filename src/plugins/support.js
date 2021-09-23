const path = require('path');
const semver = require('semver');
const pkgSupport = require('@pkgjs/support');
const nv = require('@pkgjs/nv');

const { stringBuilder, warning, success } = require('../lib/format');
const { createWarning } = require('../lib/result');
const { fetchGithub } = require('../lib/network');

const supportPlugin = async (pkg, config, options) => {
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

  const tlsUndetermined = supportData === 'unknown' && engines === '0.0.0';
  const nonNapiNativeModule = await isNonNapiNativeModule(pkg, options);

  if (tlsUndetermined && nonNapiNativeModule) {
    return createWarning(`The native module "${pkg.name}" does not use ` +
      'Node-API and does not specify the engines field or ' +
      'package-support.json, so we cannot determine if it supports the LTS ' +
      'versions of Node.js.');
  }

  if (tlsUndetermined) {
    return createWarning(`The module "${pkg.name}" does not specify the ` +
      'engines field or package-support.json, so we cannot determine if it ' +
      'supports the LTS versions of Node.js.');
  }

  return createWarning(`The module "${pkg.name}" has no support for the LTS ` +
    `version(s) ${unsupportedVersions} of Node.js.`);
};

async function isNonNapiNativeModule (pkg, options) {
  if (pkg?.repository?.url) {
    const githubTarget = pkg.repository.url
      .split('github.com/')[1]
      .replace('.git', '');

    const commitHistory = await fetchGithub(
      `/repos/${githubTarget}/commits`,
      options.githubToken
    );

    const repoTreeURL = commitHistory[0].commit.tree.url;
    const repoTree = await fetchGithub(repoTreeURL, options.githubToken, true);

    const bindingGyp = repoTree.tree.find(
      ({ path, type }) => path.includes('binding.gyp') && type === 'blob'
    );

    if (bindingGyp) {
      return true;
    }
  }

  return pkg?.dependencies?.nan;
}

module.exports = supportPlugin;
