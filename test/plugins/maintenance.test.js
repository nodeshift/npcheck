/* eslint-env jest */

const network = require('../../src/lib/fetch');
const { success, warning } = require('../../src/lib/format');
const maintenancePlugin = require('../../src/plugins/maintenance');

jest.mock('../../src/lib/fetch');
jest.mock('../../src/lib/format', () => ({
  ...jest.requireActual('../../src/lib/format'),
  failure: jest.fn(),
  success: jest.fn(),
  warning: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('should return null when module has a recent release', async () => {
  network.fetchGithub.mockImplementation(() => {
    return [{ published_at: new Date() }];
  });

  const pkg = {
    repository: {
      url: 'git+https://github.com/test/test.git'
    }
  };

  const result = await maintenancePlugin(pkg, null, {});

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return a warning when release is more than six months old', async () => {
  network.fetchGithub.mockImplementation(() => {
    return [{ published_at: new Date(new Date() - 123456789123) }];
  });

  const pkg = {
    repository: {
      url: 'git+https://github.com/test/test.git'
    }
  };

  const result = await maintenancePlugin(pkg, null, {});
  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});

it('should return a warning when a module has no releases', async () => {
  network.fetchGithub.mockImplementation(() => {
    return [];
  });

  const pkg = {
    repository: {
      url: 'git+https://github.com/test/test.git'
    }
  };

  const result = await maintenancePlugin(pkg, null, {});
  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});
