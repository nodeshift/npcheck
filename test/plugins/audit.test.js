/* eslint-env jest */

const network = require('../../src/lib/network');
const npm = require('../../src/lib/npm');
const auditPlugin = require('../../src/plugins/audit');
const { success, warning, failure } = require('../../src/lib/format');

jest.mock('../../src/lib/network');
jest.mock('../../src/lib/npm');

jest.mock('../../src/lib/format', () => ({
  ...jest.requireActual('../../src/lib/format'),
  failure: jest.fn(),
  success: jest.fn(),
  warning: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('should return null if no vulnerabilities are found', async () => {
  npm.getAuditInfo.mockImplementation(() => {
    return Promise.resolve({
      auditReportVersion: 2,
      vulnerabilities: {}
    });
  });

  const result = await auditPlugin();
  expect(result).toBe(null);
  expect(success).toHaveBeenCalled();
});

it('should return an error if a critical vulnerability is active for more than 1 month', async () => {
  // mocking the NPM audit info
  npm.getAuditInfo.mockImplementation(() => {
    return Promise.resolve({
      auditReportVersion: 2,
      vulnerabilities: {
        'bad-package': {
          name: 'bad-package',
          severity: 'critical',
          via: [
            {
              source: 1756,
              url: 'https://npmjs.com/advisories/1756'
            }
          ]
        }
      }
    });
  });
  // mocking http request
  network.fetch.mockImplementation(() => {
    return Promise.resolve({
      id: 1756,
      cves: ['CVE-2021-25945'],
      created: '2021-06-08T23:17:06.692',
      updated: '2021-06-08T23:17:06.692'
    });
  });

  const result = await auditPlugin();
  expect(result.length).toBe(1);
  expect(result[0].type).toBe('error');
  expect(network.fetch).toHaveBeenCalled();
  expect(network.fetch).toHaveBeenCalledWith(
    'https://registry.npmjs.org/-/npm/v1/security/advisories/1756'
  );
  expect(failure).toHaveBeenCalled();
});

it('should return a warning if a moderate vulnerability is active for more than 4 months', async () => {
  // mocking the NPM audit info
  npm.getAuditInfo.mockImplementation(() => {
    return Promise.resolve({
      auditReportVersion: 2,
      vulnerabilities: {
        'bad-package': {
          name: 'bad-package',
          severity: 'moderate',
          via: [
            {
              source: 1756,
              url: 'https://npmjs.com/advisories/1756'
            }
          ]
        }
      }
    });
  });
  // mocking http request
  network.fetch.mockImplementation(() => {
    return Promise.resolve({
      id: 1756,
      cves: ['CVE-2021-25945'],
      created: '2021-06-08T23:16:33.057',
      updated: '2021-02-08T23:17:06.691'
    });
  });

  const result = await auditPlugin();

  expect(result.length).toBe(1);
  expect(result[0].type).toBe('warning');
  expect(network.fetch).toHaveBeenCalled();
  expect(network.fetch).toHaveBeenCalledWith(
    'https://registry.npmjs.org/-/npm/v1/security/advisories/1756'
  );
  expect(warning).toHaveBeenCalled();
});

it("should return a warning if they're more than 10 low risk vulnerabilities", async () => {
  npm.getAuditInfo.mockImplementation(() => {
    const vulnerabilities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce(
      (state, i) => {
        return {
          ...state,
          [`bad-package-${i}`]: {
            name: `bad-package-${i}`,
            severity: 'low',
            via: [
              {
                source: i,
                url: `https://npmjs.com/advisories/${i}`
              }
            ]
          }
        };
      },
      {}
    );
    return Promise.resolve({
      auditReportVersion: 2,
      vulnerabilities
    });
  });
  /*
    Mocking http requests.
    The data will be the same for all vulnerabilities but it's not important for this case.
  */
  network.fetch.mockImplementation(() => {
    return Promise.resolve({
      id: 1756,
      cves: ['CVE-2021-25945'],
      created: '2021-06-08T23:16:33.057',
      updated: '2021-02-08T23:17:06.691'
    });
  });

  const result = await auditPlugin();

  expect(result.length).toBe(1);
  expect(result[0].type).toBe('warning');
  expect(warning).toHaveBeenCalled();
});
