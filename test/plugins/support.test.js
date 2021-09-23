/* eslint-env jest */

const pkgSupport = require('@pkgjs/support');
const nv = require('@pkgjs/nv');
const network = require('../../src/lib/network');

const supportPlugin = require('../../src/plugins/support');
const { success, warning } = require('../../src/lib/format');

jest.mock('../../src/lib/network');
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

it("should return a N-API warning if the package doesn't have support for LTS and is a C++ addon native module", async () => {
  // mocking http request to GitHub to get binding.gyp
  network.fetchGithub.mockImplementationOnce(() => {
    return Promise.resolve([{
      commit: { tree: { url: 'dummy-url' } }
    }]);
  }).mockImplementationOnce(() => {
    return Promise.resolve({
      tree: { find: () => true }
    });
  });

  pkgSupport.getSupportData.mockImplementation(() => {
    return { contents: 'unknown' };
  });

  const pkg = {
    name: 'test',
    repository: {
      url: 'git+https://github.com/n/n.git'
    }
  };

  nv.mockImplementation(() => {
    return Promise.resolve([{ version: '14.2.20' }, { version: '16.3.19' }]);
  });

  const result = await supportPlugin(pkg, {}, { githubToken: 'dummyToken' });

  expect(result.reason).toContain('native');
  expect(result.reason).toContain('Node-API');
  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});

it("should return a N-API warning if the package doesn't have support for LTS and is a NAN native module", async () => {
  // mocking http request to GitHub with no binding.gyp
  network.fetchGithub.mockImplementationOnce(() => {
    return Promise.resolve([{
      commit: { tree: { url: 'dummy-url' } }
    }]);
  }).mockImplementationOnce(() => {
    return Promise.resolve({
      tree: { find: () => false }
    });
  });

  pkgSupport.getSupportData.mockImplementation(() => {
    return { contents: 'unknown' };
  });

  const pkg = {
    name: 'test',
    repository: {
      url: 'git+https://github.com/n/n.git'
    },
    dependencies: {
      lodash: '^4.17.21',
      nan: '^3.0.0'
    }
  };

  nv.mockImplementation(() => {
    return Promise.resolve([{ version: '14.2.20' }, { version: '16.3.19' }]);
  });

  const result = await supportPlugin(pkg, {}, { githubToken: 'dummyToken' });

  expect(result.reason).toContain('native');
  expect(result.reason).toContain('Node-API');
  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});

it("should not return a N-API warning if the package doesn't have support for LTS and is a N-API native module", async () => {
  // mocking http request to GitHub with no binding.gyp
  network.fetchGithub.mockImplementationOnce(() => {
    return Promise.resolve([{
      commit: { tree: { url: 'dummy-url' } }
    }]);
  }).mockImplementationOnce(() => {
    return Promise.resolve({
      tree: { find: () => false }
    });
  });

  pkgSupport.getSupportData.mockImplementation(() => {
    return { contents: 'unknown' };
  });

  const pkg = {
    name: 'test',
    repository: {
      url: 'git+https://github.com/n/n.git'
    },
    dependencies: {
      lodash: '^4.17.21',
      'node-addon-api': '^3.0.0'
    }
  };

  nv.mockImplementation(() => {
    return Promise.resolve([{ version: '14.2.20' }, { version: '16.3.19' }]);
  });

  const result = await supportPlugin(pkg, {}, { githubToken: 'dummyToken' });

  expect(result.reason).not.toContain('Node-API');
  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});
