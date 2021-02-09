const axios = require('axios');
const { pass, fail } = require('../lib/logger');

module.exports = async (context) => {
  // extract stuff from the context
  const { pkgInfo, core } = context;

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
    core.errors++;
    core.logs.push({
      type: 'error',
      message:
        `The repository of the "${pkgInfo.name}" module seems to be archived. (https://www.github.com/${githubTarget})`
    });
    fail(archiveOutput);
  } else {
    pass(archiveOutput);
  }
};
