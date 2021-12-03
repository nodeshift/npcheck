const Arborist = require('@npmcli/arborist');
const { createError, createWarning } = require('../lib/result');
const isGitURL = require('is-git-url');

const NUM_OF_DEPS = 20;

const resolvedPlugin = async (pkg, config, options, path = './npcheck-env') => {
  const results = [];
  const arborist = new Arborist({ path: path });
  const result = await arborist.loadActual();
  const children = result.children;
  if (children.size - 1 > NUM_OF_DEPS) { // minus 1, the module itself
    results.push(
      createWarning(
        `The module "${pkg.name}" has "${children.size - 1}" dependencies (including sub-dependencies) which is more than the default "${NUM_OF_DEPS}".`
      )
    );
  }
  children.forEach(c => {
    const resolved = c.resolved.toString();
    if (isGitURL(resolved)) {
      results.push(
        createError(
          `The module "${pkg.name}" depends on the "${c.name}" which is using git instead of npm registry.`
        )
      );
    }
  });

  return results;
};

module.exports = resolvedPlugin;
