const R = require('ramda');
const { differenceInDays, formatDistanceToNow } = require('date-fns');
const { createWarning } = require('../lib/result');
const { stringBuilder, success, warning } = require('../lib/format');

const SIX_MONTHS = 183; // in days

const maintenancePlugin = async (pkg, _, options) => {
  // getting package release list from NPM `time` field,
  // more info (https://docs.npmjs.com/cli/v7/commands/npm-view)
  const releases = pkg.time || [];
  const releasesTags = Object.keys(releases);

  const output = stringBuilder('\nChecking maintenance metrics').withPadding(
    66
  );

  const latestRelease = R.last(releasesTags);

  if (!latestRelease) {
    warning(output.get());
    return createWarning(`No releases found for the ${pkg.name} module`);
  }

  const now = new Date();
  const releaseDate = new Date(releases[latestRelease]);

  const difference = differenceInDays(now, releaseDate);

  if (difference > SIX_MONTHS) {
    warning(output.get());
    const distance = formatDistanceToNow(releaseDate);
    const reason = `The latest release of "${pkg.name}" was ${distance} ago`;
    return createWarning(reason);
  }

  success(output.get());
  return null;
};

module.exports = maintenancePlugin;
