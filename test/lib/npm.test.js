/* eslint-env jest */

const { buildInstallCommand, getInfoFromNPM } = require('../../src/lib/npm');

jest.mock('child_process', () => {
  return {
    execSync: jest.fn(() => '{ "name": "nodeshift", "deps": [] }')
  };
});

it('should build the npm install command.', () => {
  const pkg = 'nodeshift';
  const path = '/Users/alex/workspace/_env';

  const response = buildInstallCommand(pkg, path);
  const expected = `npm install --prefix ${path} ${pkg}`;

  expect(response).toBe(expected);
});

it('should get package info from NPM.', () => {
  const response = getInfoFromNPM('nodeshift');
  const expected = { name: 'nodeshift', deps: [] };

  expect(response).toStrictEqual(expected);
});
