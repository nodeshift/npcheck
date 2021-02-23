const chalk = require('chalk');

const pass = (message, label = 'PASS') => {
  console.log(`${message}${chalk.bgGreen.white.bold(` ${label} `)}`);
};

const fail = (message, label = 'FAIL') => {
  console.log(`${message}${chalk.bgRed.white.bold(` ${label} `)}`);
};

const warn = (message, label = 'FORCED') => {
  console.log(`${message}${chalk.bgYellow.black.bold(` ${label} `)}`);
};

module.exports = { pass, fail, warn };
