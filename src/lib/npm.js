const { execSync } = require('child_process');

module.exports = {
  getInfoFromNPM: (module) => {
    const data = execSync(`npm show ${module} --json`, { encoding: 'utf-8' });
    return JSON.parse(data);
  },
  getAuditInfo: () => {
    const envPath = './npcheck-env';
    const npmAuditCmd = `npm audit --prefix ${envPath} --json --only=prod`;
    return JSON.parse(execSync(npmAuditCmd, { encoding: 'utf-8' }));
  },
  buildInstallCommand: (name, path) => {
    return 'npm install'.concat(` --prefix ${path}`).concat(` ${name}`);
  }
};
