const axios = require('axios');

const createStats = require('../helpers/create-stats');
const npmInfo = require('../helpers/npm-info');
const { pass, fail } = require('../utils/logger');

module.exports = async (pkg, config, options, cache) => {
  const pkgInfo = cache.pkgInfo || npmInfo(pkg.name);
  const stats = createStats();

  // npm test command presence
  const npmScripts = pkgInfo.scripts || [];
  const npmTestCommand = Object.keys(npmScripts).find(cmd => cmd.includes('test'));

  // test directory
  const githubTarget = pkgInfo.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  const { data: commitHistory } = await axios.get(
      `https://api.github.com/repos/${githubTarget}/commits`
  );

  const repoTreeURL = commitHistory[0].commit.tree.url;

  const { data: repoTree } = await axios.get(repoTreeURL);

  const testDirectory = repoTree.tree.find(({ path, type }) => path.includes('test') && type === 'tree');

  const testOutput = '\nChecking if module has appropriate testing'.padEnd(
    66,
    ' '
  );

  if (npmTestCommand || testDirectory) {
    pass(testOutput);
  } else {
    stats.errors += 1;
    stats.logs.push({
      type: 'error',
      message:
        `The "${pkgInfo.name}" seems that is lacking appropriate testing (https://www.github.com/${githubTarget})`
    });
    fail(testOutput);
  }

  return stats;
};
