const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// 'MIT OR Apache.2.0'.match('MIT')
const matchLicenses = (license, target) => {
  const filter = new RegExp(`\\b${escapeRegExp(target)}\\b`);
  const match = Array.isArray(license)
    ? license.join(' OR ').match(filter)
    : license.match(filter);
  return match !== null;
};

module.exports = {
  escapeRegExp,
  matchLicenses
};
