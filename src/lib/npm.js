const { execSync } = require('child_process');

module.exports = {
  getInfoFromNPM: (module) => {
    const data = execSync(`npm show ${module} --json`, { encoding: 'utf-8' });
    return JSON.parse(data);
  },
  buildInstallCommand: (name, path) => {
    return 'npm install'
      .concat(' --no-package-lock --silent')
      .concat(` --prefix ${path}`)
      .concat(` ${name}`);
  }
};
