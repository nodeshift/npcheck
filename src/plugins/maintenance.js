const R = require('ramda');
const { differenceInDays, formatDistanceToNow } = require('date-fns');
const { passThroughError } = require('../lib/result');
const { stringBuilder, printWarning, success, warning } = require('../lib/format');
const { fetchGithub } = require('../lib/fetch');

const SIX_MONTHS = 183; // in days

const maintenancePlugin = async (module, _, options) => {
  const githubTarget = module.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  const output = stringBuilder('\nChecking maintenance metrics').withPadding(66);

  const releases = await fetchGithub(
    `/repos/${githubTarget}/releases`,
    options.githubToken
  );
  const latestRelease = R.head(releases);

  if (!latestRelease) {
    warning(output.get());
    return passThroughError(`No releases found for the ${module.name} module`);
  }

  const now = new Date();
  const releaseDate = new Date(latestRelease?.published_at);

  const difference = differenceInDays(now, releaseDate);

  if (difference > SIX_MONTHS) {
    warning(output.get());
    const reason =
      `The latest release of "${module.name}" was ${formatDistanceToNow(releaseDate)} ago`;
    printWarning(`\n${reason}`);
    return passThroughError(reason);
  }

  success(output.get());
  return null;
};

module.exports = maintenancePlugin;
