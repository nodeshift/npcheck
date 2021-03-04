const axios = require('axios');
const createStats = require('../helpers/create-stats');
const { pass, fail } = require('../utils/logger');

module.exports = async (pkgInfo, config, options) => {
  const stats = createStats();

  const githubTarget = pkgInfo.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  const { data } = await axios.get(
      `https://api.github.com/repos/${githubTarget}`
  );

  // check if package's repo is archived
  const archiveOutput = 'Checking if github repository is archived'.padEnd(
    65,
    ' '
  );

  if (data.archived) {
    stats.errors += 1;
    stats.logs.push({
      type: 'error',
      message:
        `The repository of the "${pkgInfo.name}" module seems to be archived. (https://www.github.com/${githubTarget})`
    });
    fail(archiveOutput);
  } else {
    pass(archiveOutput);
  }

  return stats;
};
