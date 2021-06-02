const { error } = require('../lib/result');
const { stringBuilder, success, failure } = require('../lib/format');
const { fetchGithub } = require('../lib/fetch');

const archivePlugin = async (pkg, _, options) => {
  const githubTarget = pkg.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  const repo = await fetchGithub(`/repos/${githubTarget}`, options.githubToken);

  const output = stringBuilder(
    'Checking if github repository is archived'
  ).withPadding(65);

  if (repo.deprecated) {
    failure(output.get());
    return error(
      `The repository of the "${pkg.name}" module seems to be archived. (https://www.github.com/${githubTarget})`
    );
  }

  success(output.get());
  return null;
};

module.exports = archivePlugin;
