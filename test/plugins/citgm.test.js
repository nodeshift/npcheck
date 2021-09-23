/* eslint-env jest */

const nv = require('@pkgjs/nv');

const network = require('../../src/lib/network');
const format = require('../../src/lib/format');
const citgmPlugin = require('../../src/plugins/citgm');

jest.mock('@pkgjs/nv');
jest.mock('../../src/lib/network');
jest.mock('../../src/lib/format', () => ({
  ...jest.requireActual('../../src/lib/format'),
  failure: jest.fn(),
  success: jest.fn(),
  warning: jest.fn()
}));

const CITGM_LOOKUP_URL = '/repos/nodejs/citgm/contents/lib/lookup.json?ref=HEAD';

const mockCITGMLookup = (content, encoding = 'utf8') => {
  network.fetchGithub.mockImplementation(() => {
    return Promise.resolve({ content, encoding });
  });
};

beforeEach(() => {
  nv.mockImplementation(() => {
    return Promise.resolve([{ version: '12.22.5' }, { version: '14.17.5' }, { version: '16.7.0' }]);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

it('should succeed if package is tested by community CITGM', async () => {
  mockCITGMLookup('{ "mymodule": {} }');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.success).toHaveBeenCalled();
  expect(result).toBeNull();
});

it('should warn if package is not tested by community CITGM', async () => {
  mockCITGMLookup('{}');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.warning).toHaveBeenCalled();
  expect(result.type).toBe('warning');
});

it('should warn if package is skipped everywhere', async () => {
  mockCITGMLookup('{ "mymodule": { "skip": true } }');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.warning).toHaveBeenCalled();
  expect(result.type).toBe('warning');
});

it('should warn if package is skipped everywhere (array version)', async () => {
  mockCITGMLookup('{ "mymodule": { "skip": [ true ] } }');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.warning).toHaveBeenCalled();
  expect(result.type).toBe('warning');
});

it('should warn if package is skipped for in support versions', async () => {
  mockCITGMLookup('{ "mymodule": { "skip": ">10" } }');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.warning).toHaveBeenCalled();
  expect(result.type).toBe('warning');
});

it('should warn if package is skipped for in support versions (array version)', async () => {
  mockCITGMLookup('{ "mymodule": { "skip": [ ">10" ] } }');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.warning).toHaveBeenCalled();
  expect(result.type).toBe('warning');
});

it('should succeed if package if skips do not affect in support versions', async () => {
  mockCITGMLookup('{ "mymodule": { "skip": "<10" } }');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.success).toHaveBeenCalled();
  expect(result).toBeNull();
});

it('should succeed if package if skips do not affect in support versions (array version)', async () => {
  mockCITGMLookup('{ "mymodule": { "skip": ["<10"] } }');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.success).toHaveBeenCalled();
  expect(result).toBeNull();
});

it('should succeed if package if skips are only platform specific', async () => {
  mockCITGMLookup('{ "mymodule": { "skip": "aix" } }');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.success).toHaveBeenCalled();
  expect(result).toBeNull();
});

it('should succeed if package if skips are only platform specific (array version)', async () => {
  mockCITGMLookup('{ "mymodule": { "skip": ["aix", "s390", "ppc" ] } }');

  const pkg = {
    name: 'mymodule'
  };

  const result = await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.success).toHaveBeenCalled();
  expect(result).toBeNull();
});

it('should not perform partial matches', async () => {
  mockCITGMLookup('{ "mymodule2": {} }');

  const pkg = {
    name: 'mymodule'
  };

  await citgmPlugin(pkg, null, {});
  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith(CITGM_LOOKUP_URL, undefined);
  expect(format.warning).toHaveBeenCalled();
});
