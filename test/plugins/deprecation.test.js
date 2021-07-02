/* eslint-env jest */

const format = require('../../src/lib/format');
const deprecationPlugin = require('../../src/plugins/deprecation');

jest.mock('../../src/lib/format', () => ({
  ...jest.requireActual('../../src/lib/format'),
  failure: jest.fn(),
  success: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('should return null if module is not deprecated', async () => {
  const pkg = {};
  const result = await deprecationPlugin(pkg);

  expect(result).toBe(null);
  expect(format.success).toHaveBeenCalled();
});

it('should return error result if module is deprecated', async () => {
  const pkg = { deprecated: 'this version has been deprecated' };
  const result = await deprecationPlugin(pkg);

  expect(result.type).toBe('error');
  expect(format.failure).toHaveBeenCalled();
});

it('should return error result if module is deprecated with custom message', async () => {
  const pkg = { deprecated: 'replaced by a different NPM package' };
  const result = await deprecationPlugin(pkg);

  expect(result.type).toBe('error');
  expect(format.failure).toHaveBeenCalled();
});
