const { stringBuilder, success, warning } = require('../lib/format');
const { passThroughError } = require('../lib/result');
const { fetchGithub } = require('../lib/fetch');

const supportPlugin = async (module, config, options) => {
  // Support plugin output
  const output = stringBuilder('\nChecking for LTS support').withPadding(66);

  // Check if module has a support field
  const hasSupportField = module.support === true;
  if (!hasSupportField) {
    warning(output.get());
    return passThroughError(`The module ${module.name} has no support field.`);
  }

  // If support field exists fetch the `package-support.json`
  const githubTarget = module.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  let pkgSupport;

  try {
    // Get package-support.json file info from github
    const uri = `/repos/${githubTarget}/contents/package-support.json`;
    const blob = await fetchGithub(uri, options.githubToken);

    // Get the file contents from github
    pkgSupport = await fetchGithub(
      blob.download_url,
      options.githubToken,
      true
    );
  } catch (err) {
    warning(output.get());
    return passThroughError(
      `The module ${module.name} has no package-support.json file.`
    );
  }

  // Check for LTS node target
  const targetingLTS = pkgSupport.versions?.find(
    (item) => item?.target?.node === 'lts'
  );

  if (!targetingLTS) {
    warning(output.get());
    return passThroughError(
      `The module ${module.name} has no support for the LTS version of node.`
    );
  }

  success(output.get());
  return null;
};

module.exports = supportPlugin;
