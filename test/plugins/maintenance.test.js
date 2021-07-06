/* eslint-env jest */

const { success, warning } = require('../../src/lib/format');
const maintenancePlugin = require('../../src/plugins/maintenance');

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
  const pkg = {
    repository: {
      url: 'git+https://github.com/test/test.git'
    },
    time: {
      modified: '2021-06-16T11:44:53.605Z',
      created: '2010-12-29T19:38:25.450Z',
      '5.0.0-alpha.3': '2017-01-29T03:28:41.274Z',
      '4.15.0': '2017-03-01T22:28:55.984Z',
      '5.0.0-alpha.4': new Date()
    }
  };

  const result = await maintenancePlugin(pkg, null, {});

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return a warning when release is more than six months old', async () => {
  const pkg = {
    repository: {
      url: 'git+https://github.com/test/test.git'
    },
    time: {
      modified: '2021-06-16T11:44:53.605Z',
      created: '2010-12-29T19:38:25.450Z',
      '5.0.0-alpha.3': '2017-01-29T03:28:41.274Z',
      '4.15.0': '2017-03-01T22:28:55.984Z',
      '5.0.0-alpha.4': new Date(new Date() - 123456789123)
    }
  };

  const result = await maintenancePlugin(pkg, null, {});
  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});

it('should return a warning when a module has no releases', async () => {
  const pkg = {
    repository: {
      url: 'git+https://github.com/test/test.git'
    }
  };

  const result = await maintenancePlugin(pkg, null, {});
  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});
