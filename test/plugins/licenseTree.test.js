/* eslint-env jest */

const licenseChecker = require('license-checker');
const licenseTreePlugin = require('../../src/plugins/licenseTree');
const { success, warning, failure } = require('../../src/lib/format');

jest.mock('license-checker');

jest.mock('../../src/lib/format', () => ({
  ...jest.requireActual('../../src/lib/format'),
  failure: jest.fn(),
  success: jest.fn(),
  warning: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('should return an empty list when the dep-tree has acceptable licenses', async () => {
  // mock licenseChecker's functionality
  licenseChecker.init.mockImplementation((_, cb) => {
    const packages = {
      dummy: {
        licenses: 'MIT',
        repository: 'https://github.com/dummy/dummy'
      },
      dummy2: {
        licenses: 'MIT',
        repository: 'https://github.com/dummy2/dummy2'
      }
    };
    cb(null, packages);
  });

  // create a sample env with some dummy data
  const testEnv = {
    pkg: {
      name: 'test'
    },
    config: {
      licenses: {
        allow: ['MIT', 'Apache-2.0'],
        rules: {}
      }
    }
  };

  const result = await licenseTreePlugin(testEnv.pkg, testEnv.config);

  expect(result).toEqual([]);
  expect(success).toBeCalledTimes(2);
});

it('should return a list of errors when deps have non-acceptable licenses', async () => {
  // mock licenseChecker's functionality
  licenseChecker.init.mockImplementation((_, cb) => {
    const packages = {
      dummy: {
        licenses: 'BSD',
        repository: 'https://github.com/dummy/dummy'
      },
      dummy2: {
        licenses: 'BSD',
        repository: 'https://github.com/dummy2/dummy2'
      }
    };
    cb(null, packages);
  });

  // create a sample env with some dummy data
  const testEnv = {
    pkg: {
      name: 'test'
    },
    config: {
      licenses: {
        allow: ['MIT', 'Apache-2.0'],
        rules: {}
      }
    }
  };

  const result = await licenseTreePlugin(testEnv.pkg, testEnv.config);

  expect(result.length).toBe(2);
  expect(result[0].type).toBe('error');
  expect(result[1].type).toBe('error');
  expect(failure).toHaveBeenCalledTimes(2);
});

it('should return an empty list when deps have "local" acceptable licenses', async () => {
  // mock licenseChecker's functionality
  licenseChecker.init.mockImplementation((_, cb) => {
    const packages = {
      dummy: {
        licenses: 'BSD',
        repository: 'https://github.com/dummy/dummy'
      },
      dummy2: {
        licenses: 'BSD',
        repository: 'https://github.com/dummy2/dummy2'
      }
    };
    cb(null, packages);
  });

  // create a sample env with some dummy data
  const testEnv = {
    pkg: {
      name: 'test',
      license: 'Apache-2.0'
    },
    config: {
      licenses: {
        allow: ['MIT', 'Apache-2.0'],
        rules: {
          test: {
            allow: ['BSD']
          }
        }
      }
    }
  };

  const result = await licenseTreePlugin(testEnv.pkg, testEnv.config);

  expect(result).toEqual([]);
  expect(success).toBeCalledTimes(2);
});

it('should return a list of warnings when deps have "non-decidable" licenses', async () => {
  // mock licenseChecker's functionality
  licenseChecker.init.mockImplementation((_, cb) => {
    const packages = {
      dummy: {
        licenses: 'BSD',
        repository: 'https://github.com/dummy/dummy'
      },
      dummy2: {
        licenses: 'BSD',
        repository: 'https://github.com/dummy2/dummy2'
      }
    };
    cb(null, packages);
  });

  // create a sample env with some dummy data
  const testEnv = {
    pkg: {
      name: 'test',
      license: 'Apache-2.0'
    },
    config: {
      licenses: {
        allow: ['MIT', 'Apache-2.0'],
        rules: {
          test: {
            override: ['BSD']
          }
        }
      }
    }
  };

  const result = await licenseTreePlugin(testEnv.pkg, testEnv.config);

  expect(result.length).toBe(2);
  expect(result[0].type).toBe('warning');
  expect(result[1].type).toBe('warning');
  expect(warning).toHaveBeenCalledTimes(2);
});
