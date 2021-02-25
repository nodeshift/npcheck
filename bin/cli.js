const runCommand = require('../lib/run');
const initCommand = require('../lib/init');
const addCommand = require('../lib/add');

module.exports = async (options) => {
  try {
    switch (options.cmd) {
      case 'run':
        await runCommand(options);
        break;
      case 'init':
        await initCommand(options);
        break;
      case 'add':
        await addCommand(options);
        break;
      default:
        throw new TypeError(`Unexpected command: ${options.cmd}`);
    }
  } catch (err) {
    console.error(err.message);
  }
};
