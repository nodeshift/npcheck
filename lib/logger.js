const chalk = require('chalk');

const pass = (message) => {
  console.log(`${message}${chalk.green.bold('[PASS]')}`);
};

const fail = (message) => {
  console.log(`${message}${chalk.red.bold('[FAIL]')}`);
};

const warn = (message) => {
  console.log(`${message}${chalk.yellow.bold('[WARNING]')}`);
};

module.exports = { pass, fail, warn };
