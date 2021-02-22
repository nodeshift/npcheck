const axios = require('axios');
const { pass, fail } = require('../lib/logger');

module.exports = async (context) => {
  // extract stuff from context
  const { pkgInfo, core } = context;

  // npm test command presence
  const npmScripts = context.pkgInfo.scripts || [];
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
    return pass(testOutput);
  }

  core.errors++;
  core.logs.push({
    type: 'error',
    message:
        `The "${pkgInfo.name}" seems that is lacking appropriate testing (https://www.github.com/${githubTarget})`
  });
  fail(testOutput);
};
