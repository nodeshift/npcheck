const fs = require('fs');
const path = require('path');
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

const createErrorLog = (output) => {
  const now = new Date();
  const filepath = path.join(process.cwd(), 'npcheck-errors.log');
  const log = `----\n${now}\n----\n${output.trim()}\n`;
  fs.appendFileSync(filepath, log);
};

module.exports = {
  stringBuilder,
  printStatuses,
  createErrorLog,
  success,
  failure,
  warning
};
