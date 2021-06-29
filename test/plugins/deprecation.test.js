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
  const pkg = { deprecated: false };
  const result = await deprecationPlugin(pkg);

  expect(result).toBe(null);
});

it('should log success message if module is not deprecated', async () => {
  const pkg = { deprecated: false };
  await deprecationPlugin(pkg);

  expect(format.success).toHaveBeenCalled();
});

it('should return error result if module is deprecated', async () => {
  const pkg = { deprecated: 'this version has been deprecated' };
  const result = await deprecationPlugin(pkg);

  expect(result.type).toBe('error');
});

it('should log failure message if module is deprecated', async () => {
  const pkg = { deprecated: 'this version has been deprecated' };
  await deprecationPlugin(pkg);

  expect(format.failure).toHaveBeenCalled();
});
