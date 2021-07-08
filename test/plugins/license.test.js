/* eslint-env jest */

const { success, warning, failure } = require('../../src/lib/format');
const licensePlugin = require('../../src/plugins/license');

jest.mock('../../src/lib/format', () => ({
  ...jest.requireActual('../../src/lib/format'),
  failure: jest.fn(),
  success: jest.fn(),
  warning: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('should return null when license is globally accepted', async () => {
  // create a sample env with some dummy data
  const testEnv = {
    pkg: {
      name: 'test',
      license: 'MIT'
    },
    config: {
      licenses: {
        allow: ['MIT', 'Apache-2.0'],
        rules: {}
      }
    }
  };

  const result = await licensePlugin(testEnv.pkg, testEnv.config);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should handle the case where the license field is an array', async () => {
  // create a sample env with some dummy data
  const testEnv = {
    pkg: {
      name: 'test',
      licenses: [
        {
          type: 'MIT',
          url: 'https://raw.github.com/test/test/master/licence'
        }
      ]
    },
    config: {
      licenses: {
        allow: ['MIT', 'Apache-2.0'],
        rules: {}
      }
    }
  };

  const result = await licensePlugin(testEnv.pkg, testEnv.config);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return null when the license is locally accepted', async () => {
  // create a sample env with some dummy data
  const testEnv = {
    pkg: {
      name: 'test',
      license: 'Apache-2.0'
    },
    config: {
      licenses: {
        allow: ['MIT'],
        rules: {
          test: {
            allow: ['Apache-2.0']
          }
        }
      }
    }
  };

  const result = await licensePlugin(testEnv.pkg, testEnv.config);

  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return a warning when the license is locally overridden', async () => {
  // create a sample env with some dummy data
  const testEnv = {
    pkg: {
      name: 'test',
      license: 'Apache-2.0'
    },
    config: {
      licenses: {
        allow: ['MIT'],
        rules: {
          test: {
            override: ['Apache-2.0']
          }
        }
      }
    }
  };

  const result = await licensePlugin(testEnv.pkg, testEnv.config);

  expect(result.type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});

it('should return an error when the license is not accepted', async () => {
  // create a sample env with some dummy data
  const testEnv = {
    pkg: {
      name: 'test',
      license: 'Apache-2.0'
    },
    config: {
      licenses: {
        allow: ['MIT'],
        rules: {}
      }
    }
  };

  const result = await licensePlugin(testEnv.pkg, testEnv.config);

  expect(result.type).toBe('error');
  expect(failure).toHaveBeenCalled();
});
