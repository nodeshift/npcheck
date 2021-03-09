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
  console.log(`${text}${chalk.black.bgYellow.bold(` ${label} `)}`);
};

const printStatuses = (statuses) => {
  statuses.forEach((status) => {
    console.log(`\n${chalk.yellow(status.context)}`);
    console.log(status.description);
    console.log(status.target_url);
  });
};

module.exports = {
  stringBuilder,
  printStatuses,
  success,
  failure,
  warning
};
