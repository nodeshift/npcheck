const chalk = require('chalk');

const stringBuilder = (text) => ({
  withPadding: (length) => stringBuilder(text.padEnd(length, ' ')),
  get: () => text
});

const success = (text, label = 'PASS') => {
  console.log(`${text}${chalk.white.bgGreen.bold(` ${label} `)}`);
};

const failure = (text, label = 'FAIL') => {
  console.log(`${text}${chalk.white.bgRed.bold(` ${label} `)}`);
};

const warning = (text, label = 'WARN') => {
  console.log(`${text}${chalk.white.bgRed.bold(` ${label} `)}`);
};

module.exports = {
  stringBuilder,
  success,
  failure,
  warning
};
