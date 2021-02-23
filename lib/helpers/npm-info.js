const { execSync } = require('child_process');

module.exports = (packageName) => {
  return JSON.parse(
    execSync(`npm show ${packageName} --json`, { encoding: 'utf-8' })
  );
};
