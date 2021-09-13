const { execSync } = require('child_process');
const Arborist = require('@npmcli/arborist');
const Report = require('npm-audit-report');

module.exports = {
  getInfoFromNPM: (module) => {
    const data = execSync(`npm show ${module} --json`, { encoding: 'utf-8' });
    return JSON.parse(data);
  },
  getAuditInfo: async () => {
    const arborist = new Arborist({ path: './npcheck-env' });
    const arboristReport = await arborist.audit();
    const auditReport = Report(arboristReport, { reporter: 'json' });

    return JSON.parse(auditReport.report);
  },
  buildInstallCommand: (name, path) => {
    return `npm install --prefix ${path} ${name}`;
  }
};
