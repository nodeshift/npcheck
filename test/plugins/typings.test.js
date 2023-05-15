/* eslint-env jest */

const network = require('../../src/lib/network');
const typingsPlugin = require('../../src/plugins/typings');
const { success, warning } = require('../../src/lib/format');

jest.mock('../../src/lib/network', () => ({
  ...jest.requireActual('../../src/lib/network'),
  fetch: jest.fn()
}));

jest.mock('../../src/lib/format', () => ({
  ...jest.requireActual('../../src/lib/format'),
  failure: jest.fn(),
  success: jest.fn(),
  warning: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('should return null if the package specifies types info on package.json', async () => {
  const pkg = { name: 'test', types: 'types/index.d.ts' };
  const result = await typingsPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return null if the package specifies typings info on package.json', async () => {
  const pkg = { name: 'test', typings: 'types/index.d.ts' };
  const result = await typingsPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

/*
 * Remove these tests until we find another API to find typings see
 * https://github.com/nodeshift/npcheck/pull/138
it('should return null if the package has typescript typings through definitely-typed', async () => {
  // clear network cache before test
  network.clearCache();
  // mocking http request to GitHub
  network.fetch.mockImplementation(() => {
    return Promise.resolve([
      {
        p: 'https://github.com/nodeshift/npcheck',
        l: 'npcheck',
        g: [],
        t: 'npcheck', // <-- we're interested in this field
        m: ['npcheck'],
        d: 211011042
      }
    ]);
  });

  const pkg = { name: 'npcheck' };
  const result = await typingsPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return null if the package has typescript typings through definitely-typed', async () => {
  // clear network cache before test
  network.clearCache();
  // mocking http request to GitHub
  network.fetch.mockImplementation(() => {
    return Promise.resolve([
      {
        p: 'https://github.com/nodeshift/npcheck',
        l: '@nodeshift/npcheck',
        g: [],
        t: 'nodeshift__npcheck', // <-- we're interested in this field
        m: ['nodeshift__npcheck'],
        d: 211011042
      }
    ]);
  });

  const pkg = { name: 'nodeshift/npcheck' };
  const result = await typingsPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});
*/

it('should return a warning when the module has no typescript typings', async () => {
  // clear network cache before test
  network.clearCache();
  // mocking http request to GitHub
  network.fetch.mockImplementation(() => {
    return Promise.resolve([]);
  });

  const pkg = { name: 'nodeshift/npcheck' };
  const result = await typingsPlugin(pkg);

  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});

it("should parse the definitely-typed objects from the Microsoft's list", async () => {
  const { unmangle } = typingsPlugin;

  expect(unmangle('npcheck')).toBe('npcheck');
  expect(unmangle('nodeshift__npcheck')).toBe('nodeshift/npcheck');
  expect(unmangle('@npcheck')).toBe('npcheck');
  expect(unmangle('@nodeshift__npcheck')).toBe('nodeshift/npcheck');
});
