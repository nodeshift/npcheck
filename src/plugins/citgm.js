const { createWarning } = require('../lib/result');
const { stringBuilder, success, warning } = require('../lib/format');
const { fetchGithub } = require('../lib/network');
const nv = require('@pkgjs/nv');
const semver = require('semver');

const CITGM_REPO = 'nodejs/citgm';
const LOOKUP_PATH = 'lib/lookup.json';
const BRANCH = 'HEAD';

const getCITGMLookup = async (token) => {
  const metadata = await fetchGithub(
      `/repos/${CITGM_REPO}/contents/${LOOKUP_PATH}?ref=${BRANCH}`,
      token
  );
  const content = Buffer.from(metadata.content, metadata.encoding);
  return JSON.parse(content);
}

const citgmPlugin = async (pkg, _, options) => {
  // Support plugin output
  const output = stringBuilder(
      '\nChecking if module is tested by community CITGM runs'
  ).withPadding(66);

  const lookup = await getCITGMLookup(options.token);
  if (!lookup[pkg.name]) {
    warning(output.get());
    return createWarning(
        `The module "${pkg.name}" is not tested by community CITGM runs.`
    );
  }
  const skip = lookup[pkg.name].skip;
  if (skip !== undefined) {
    if (skip === true || (Array.isArray(skip) && skip.includes(true))) {
      warning(output.get());
      return createWarning(
          `The module "${pkg.name}" is not tested (skipped) by community CITGM runs.`
      );
    }
    const lts = (await nv('supported')).map(v => v.version);
    for (version of lts) {
      if ((!Array.isArray(skip) && semver.satisfies(version, skip)) || Array.isArray(skip) && skip.some(v => semver.satisfies(version, v))) {
        warning(output.get());
        return createWarning(
            `The module "${pkg.name}" is not tested (skipped on ${version}) by community CITGM runs.`
        );
      }
    }
  }
  success(output.get());
  return null;
};

module.exports = citgmPlugin;
