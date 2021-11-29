const Arborist = require('@npmcli/arborist');
const { createError } = require('../lib/result');
const isGitURL = require('is-git-url');

const resolvedPlugin = async (pkg, config, options, path = './npcheck-env') => {
  const results = [];
  const arborist = new Arborist({ path: path });
  const result = await arborist.loadActual();
  const children = result.children;
  children.forEach(c => {
    const resolved = c.resolved.toString();
    if (isGitURL(resolved)) {
      results.push(
        createError(
          `The module "${pkg.name}" depends on "${c.name}" using a git URL instead of fetching from an npm registry.`
        )
      );
    }
  });

  return results;
};

module.exports = resolvedPlugin;
