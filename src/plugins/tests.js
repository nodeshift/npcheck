const axios = require('axios');
const R = require('ramda');
const { stringBuilder, printStatuses, success, failure } = require('../lib/format');
const { error } = require('../lib/result');

module.exports = async (module) => {
  // Find npm test script (if exists)
  const npmScripts = module.scripts || [];
  const npmTestCommand = Object.keys(npmScripts).find(cmd => cmd.includes('test'));

  // Test directory
  const githubTarget = module.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  const { data: commitHistory } = await axios.get(
    `https://api.github.com/repos/${githubTarget}/commits`
  );

  const repoTreeURL = commitHistory[0].commit.tree.url;
  const { data: repoTree } = await axios.get(repoTreeURL);

  const testDirectory = repoTree.tree.find(({ path, type }) => path.includes('test') && type === 'tree');
  const testOutput = stringBuilder('\nChecking if module has appropriate testing').withPadding(66);

  const commitHash = commitHistory[0].sha;
  const { data: repoStatuses } = await axios.get(`https://api.github.com/repos/${githubTarget}/commits/${commitHash}/statuses`);

  const parseStatuses = R.pipe(
    R.filter((status) => status.state !== 'pending'),
    R.groupBy((status) => status.context),
    R.mapObjIndexed(
      R.pipe(
        R.sort((a, b) => new Date(b) - new Date(a)),
        R.head
      )
    )
  );

  const statusRecords = parseStatuses(repoStatuses);
  const statuses = Object.keys(statusRecords).map(key => statusRecords[key]);

  if (npmTestCommand || testDirectory) {
    success(testOutput.get());
    printStatuses(statuses);
    return null;
  }

  failure(testOutput.get());
  printStatuses(statuses);
  return error(`The "${module.name}" seems that is lacking appropriate testing (https://www.github.com/${githubTarget})`);
};
