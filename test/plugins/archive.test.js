/* eslint-env jest */

const network = require('../../src/lib/fetch');
const format = require('../../src/lib/format');
const archivePlugin = require('../../src/plugins/archive');

jest.mock('../../src/lib/fetch');
jest.mock('../../src/lib/format', () => ({
  ...jest.requireActual('../../src/lib/format'),
  failure: jest.fn(),
  success: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('should return null if the package is not archived', async () => {
  // mocking http request to GitHub
  network.fetchGithub.mockImplementation(() => {
    return Promise.resolve({
      deprecated: false
    });
  });

  const pkg = {
    repository: {
      url: 'git+https://github.com/n/n.git'
    }
  };

  const result = await archivePlugin(pkg, null, {});

  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith('/repos/n/n', undefined);
  expect(result).toBe(null);
});

it('should log success message when module is not archived', async () => {
  // mocking http request to GitHub
  network.fetchGithub.mockImplementation(() => {
    return Promise.resolve({
      deprecated: false
    });
  });

  const pkg = {
    repository: {
      url: 'git+https://github.com/n/n.git'
    }
  };

  await archivePlugin(pkg, null, {});

  expect(format.success).toHaveBeenCalled();
});

it('should return error result if the package is archived', async () => {
  // mocking http request to GitHub
  network.fetchGithub.mockImplementation(() => {
    return Promise.resolve({
      deprecated: true
    });
  });

  const pkg = {
    name: 'n',
    repository: {
      url: 'git+https://github.com/n/n.git'
    }
  };

  const result = await archivePlugin(pkg, null, {});

  expect(network.fetchGithub).toHaveBeenCalled();
  expect(network.fetchGithub).toBeCalledWith('/repos/n/n', undefined);
  expect(result.type).toBe('error');
});

it('should log failure message when module is archived', async () => {
  // mocking http request to GitHub
  network.fetchGithub.mockImplementation(() => {
    return Promise.resolve({
      deprecated: true
    });
  });

  const pkg = {
    repository: {
      url: 'git+https://github.com/n/n.git'
    }
  };

  await archivePlugin(pkg, null, {});

  expect(format.failure).toHaveBeenCalled();
});
