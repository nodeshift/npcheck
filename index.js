const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const { execSync } = require('child_process');

const YAML = require('yaml');
const axios = require('axios');
const checker = require('license-checker');
const mkdirp = require('mkdirp');

const checkerInitAsync = promisify(checker.init);

const main = async () => {
  // load orion config
  const configData = fs.readFileSync(
    path.resolve(__dirname, 'orion.config.yaml'),
    { encoding: 'utf-8' }
  );
  const config = YAML.parse(configData);

  console.log(config);

  const pkg = config.modules[0];

  // transform info to JSON
  const pkgInfo = JSON.parse(
    execSync(`npm show ${pkg.name} --json`, { encoding: 'utf-8' })
  );

  // check if package is deprecated
  if (pkgInfo.deprecated === 'this version has been deprecated') {
    console.log(`Package ${pkg.name} is deprecated!`);
  }

  const githubTarget = pkgInfo.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  const { data } = await axios.get(
    `https://api.github.com/repos/${githubTarget}`
  );

  // check if package's repo is archived
  if (data.archived) {
    console.log(`Package ${pkg.name} is archived!`);
  }

  // creating environment folder
  await mkdirp(path.resolve(__dirname, '.orion_env'));

  // installing npm module
  const npmInstallResult = execSync(
    'npm install --no-package-lock --prefix .orion_env express',
    {
      encoding: 'utf-8',
      cwd: __dirname
    }
  );

  console.log(npmInstallResult);

  // checking license of dependency tree
  const packageLicenses = await checkerInitAsync({ start: '.orion_env' });
  console.log(packageLicenses);

  // clean up
  fs.rmdirSync(path.resolve(__dirname, '.orion_env', 'node_modules'), {
    recursive: true
  });
};

main();
