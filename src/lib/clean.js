const path = require('path');
const fs = require('fs');

const clean = () => {
  const envDirectory = path.resolve(process.cwd(), 'npcheck-env');
  if (fs.existsSync(envDirectory)) {
    fs.rmdirSync(envDirectory, { recursive: true });
  }
};

module.exports = clean;
