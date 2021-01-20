const chalk = require('chalk');

const pass = (message) => {
  console.log(`${message}${chalk.bgGreen.white.bold(' PASS ')}`);
};

const fail = (message) => {
  console.log(`${message}${chalk.bgRed.white.bold(' FAIL ')}`);
};

const warn = (message) => {
  console.log(`${message}${chalk.bgYellow.black.bold(' WARNING ')}`);
};

module.exports = { pass, fail, warn };
