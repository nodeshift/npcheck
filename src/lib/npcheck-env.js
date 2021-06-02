const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { buildInstallCommand } = require('./npm');

const createEnvDirectory = (pkg) => {
  // create the env directory
  const envDirectory = path.resolve(process.cwd(), 'npcheck-env');
  fs.mkdirSync(envDirectory);
  // install current package
  const npmCommand = buildInstallCommand(pkg.name, envDirectory);
  execSync(npmCommand, {
    encoding: 'utf-8',
    cwd: __dirname,
    stdio: 'pipe'
  });
};

const cleanEnvDirectory = () => {
  const envDirectory = path.resolve(process.cwd(), 'npcheck-env');
  if (fs.existsSync(envDirectory)) {
    fs.rmdirSync(envDirectory, { recursive: true });
  }
};

module.exports = {
  createEnvDirectory,
  cleanEnvDirectory
};
