const R = require('ramda');
const { error } = require('../lib/result');
const { fetchGithub } = require('../lib/fetch');
const {
  stringBuilder,
  printStatuses,
  success,
  failure
} = require('../lib/format');

const testsPlugin = async (module, _, options) => {
  // Find npm test script (if exists)
  const npmScripts = module.scripts || [];
  const npmTestCommand = Object.keys(npmScripts).find((cmd) =>
    cmd.includes('test')
  );

  // Test directory
  const githubTarget = module.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  const commitHistory = await fetchGithub(
    `/repos/${githubTarget}/commits`,
    options.githubToken
  );

  const repoTreeURL = commitHistory[0].commit.tree.url;
  const repoTree = await fetchGithub(repoTreeURL, options.githubToken, true);

  const testDirectory = repoTree.tree.find(
    ({ path, type }) => path.includes('test') && type === 'tree'
  );
  const testOutput = stringBuilder(
    '\nChecking if module has appropriate testing'
  ).withPadding(66);

  const commitHash = commitHistory[0].sha;
  const repoStatuses = await fetchGithub(
    `/repos/${githubTarget}/commits/${commitHash}/statuses`,
    options.githubToken
  );

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
  const statuses = Object.keys(statusRecords).map((key) => statusRecords[key]);

  if (npmTestCommand || testDirectory) {
    success(testOutput.get());
    printStatuses(statuses);
    return null;
  }

  failure(testOutput.get());
  printStatuses(statuses);
  return error(
    `The "${module.name}" seems that is lacking appropriate testing (https://www.github.com/${githubTarget})`
  );
};

module.exports = testsPlugin;
