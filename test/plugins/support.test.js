/* eslint-env jest */

const pkgSupport = require('@pkgjs/support');
const nv = require('@pkgjs/nv');

const supportPlugin = require('../../src/plugins/support');
const { success, warning } = require('../../src/lib/format');

jest.mock('@pkgjs/support');
jest.mock('@pkgjs/nv');
jest.mock('../../src/lib/format', () => ({
  ...jest.requireActual('../../src/lib/format'),
  failure: jest.fn(),
  success: jest.fn(),
  warning: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('should return null if the package supports LTS through @pkgjs/support', async () => {
  // mocking the @pkgjs/support dependency
  pkgSupport.getSupportData.mockImplementation(() => {
    return {
      contents: Buffer.from('{"versions":[{"target":{"node":"all"}}]}')
    };
  });

  const pkg = { name: 'test' };

  const result = await supportPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return null if the package supports the "lts" target', async () => {
  // mocking the @pkgjs/support dependency
  pkgSupport.getSupportData.mockImplementation(() => {
    return {
      contents: Buffer.from('{"versions":[{"target":{"node":"lts"}}]}')
    };
  });

  const pkg = { name: 'test' };

  const result = await supportPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return null if the package supports the "lts_active" target', async () => {
  // mocking the @pkgjs/support dependency
  pkgSupport.getSupportData.mockImplementation(() => {
    return {
      contents: Buffer.from('{"versions":[{"target":{"node":"lts_active"}}]}')
    };
  });

  const pkg = { name: 'test' };

  const result = await supportPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return null if the package supports the "active" target', async () => {
  // mocking the @pkgjs/support dependency
  pkgSupport.getSupportData.mockImplementation(() => {
    return {
      contents: Buffer.from('{"versions":[{"target":{"node":"active"}}]}')
    };
  });

  const pkg = { name: 'test' };

  const result = await supportPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return null if the package supports the "supported" target', async () => {
  // mocking the @pkgjs/support dependency
  pkgSupport.getSupportData.mockImplementation(() => {
    return {
      contents: Buffer.from('{"versions":[{"target":{"node":"supported"}}]}')
    };
  });

  const pkg = { name: 'test' };

  const result = await supportPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return null if the package supports LTS through engines field', async () => {
  // mocking the @pkgjs/support dependency
  pkgSupport.getSupportData.mockImplementation(() => {
    return {
      contents: 'unknown'
    };
  });

  const pkg = {
    name: 'test',
    engines: {
      node: '>= 0.10.0'
    }
  };

  nv.mockImplementation(() => {
    return Promise.resolve([{ version: '14.2.20' }, { version: '16.3.19' }]);
  });

  const result = await supportPlugin(pkg);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it("should return a warning if the package doesn't have support for LTS", async () => {
  // mocking the @pkgjs/support dependency
  pkgSupport.getSupportData.mockImplementation(() => {
    return {
      contents: 'unknown'
    };
  });

  const pkg = {
    name: 'test',
    engines: {
      node: '>= 0.10.3 < 14'
    }
  };

  nv.mockImplementation(() => {
    return Promise.resolve([{ version: '14.2.20' }, { version: '16.3.19' }]);
  });

  const result = await supportPlugin(pkg);

  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});
