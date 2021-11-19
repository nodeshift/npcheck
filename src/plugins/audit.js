const { differenceInDays, min } = require('date-fns');

const { fetch } = require('../lib/network');
const { getAuditInfo } = require('../lib/npm');
const { stringBuilder, success, failure, warning } = require('../lib/format');
const { createError, createWarning } = require('../lib/result');

const ONE_MONTH = 30; // days

const isSourceVulnerability = (item) => item.source !== undefined;

const formatAudit = (v) => ({
  name: v.name,
  created: v.created,
  updated: v.updated,
  severity: v.severity,
  via: v.via,
  effects: v.effects,
  fixAvailable: v.fixAvailable,
  cve: v.cve
});

const formatOutputList = (vulnerabilities) => {
  return vulnerabilities
    .map((v) => `-> ${v.name} - ${v.cve} - ${v.via.url}`)
    .join('\n');
};

const auditPlugin = async () => {
  const auditData = await getAuditInfo();
  const audit = Object.keys(auditData.vulnerabilities)
    .map((key) => auditData.vulnerabilities[key])
    .filter((item) =>
      item.via.reduce(
        (state, current) => (state = isSourceVulnerability(current)),
        false
      )
    )
    .map((item) => {
      const source = item.via.find((v) => isSourceVulnerability(v));
      return {
        ...item,
        via: source
      };
    });

  const auditPromises = audit.map((vulnerability) =>
    (async () => {
      // Getting extra advisory data from NPM
      const data = await fetch(`https://registry.npmjs.org/-/npm/v1/security/advisories/${vulnerability.via.source}`);
      const advisory = { cve: data.cves[0], created: data.created, updated: data.updated };
      return {
        ...vulnerability,
        ...advisory
      };
    })()
  );

  const auditAsyncResult = await Promise.all(auditPromises);

  const auditResult = auditAsyncResult.map((vulnerability) => {
    return {
      ...formatAudit(vulnerability)
    };
  });

  const output = stringBuilder(
    '\nChecking for active vulnerabilities'
  ).withPadding(66);

  const auditOutcome = [];

  // Error if there is a high or above vulnerability that has not been fixed after 1 month.
  const highRisk = auditResult.filter((v) => {
    const now = new Date();
    // In some cases, e.g. https://registry.npmjs.org/-/npm/v1/security/advisories/1002643
    // the updated date is earlier than created. Pick the earlier one.
    const publishDate = min([new Date(v.created), new Date(v.updated)]);
    return (
      (v.severity === 'high' || v.severity === 'critical') &&
      differenceInDays(now, publishDate) > ONE_MONTH
    );
  });

  if (highRisk.length > 0) {
    const format = highRisk.length === 1 ? 'vulnerability' : 'vulnerabilities';
    failure(output.get());
    auditOutcome.push(
      createError(
        `${highRisk.length} high risk ${format} found.\n\n${formatOutputList(
          highRisk
        )}`
      )
    );
  }

  // Warn if there is a medium vulnerability that has not been fixed after 4 months. (report the number of these)
  const mediumRisk = auditResult.filter((v) => {
    const now = new Date();
    // In some cases, e.g. https://registry.npmjs.org/-/npm/v1/security/advisories/1002643
    // the updated date is earlier than created. Pick the earlier one.
    const publishDate = min([new Date(v.created), new Date(v.updated)]);
    return (
      v.severity === 'moderate' &&
      differenceInDays(now, publishDate) > ONE_MONTH * 4
    );
  });

  if (mediumRisk.length > 0) {
    const format = highRisk.length === 1 ? 'vulnerability' : 'vulnerabilities';
    warning(output.get());
    auditOutcome.push(
      createWarning(
        `${highRisk.length} medium risk ${format} found.\n\n${formatOutputList(
          mediumRisk
        )}`
      )
    );
  }

  // Warn if there is more than 10 Low vulnerabilities (report the number of these)
  const lowRisk = auditResult.filter((v) => v.severity === 'low');

  if (lowRisk.length >= 10) {
    const format = highRisk.length === 1 ? 'vulnerability' : 'vulnerabilities';
    warning(output.get());
    auditOutcome.push(
      createWarning(
        `${highRisk.length} low risk ${format} found.\n\n${formatOutputList(
          lowRisk
        )}`
      )
    );
  }

  if (auditOutcome.length > 0) {
    return auditOutcome;
  } else {
    // No active vulnerabilities detected.
    success(output.get());
    return null;
  }
};

module.exports = auditPlugin;
