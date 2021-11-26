/* eslint-env jest */

const resolvedPlugin = require('../../src/plugins/resolved');

it('should return a list of errors when deps are using git instead of npm', async () => {
  const testEnv = {
    pkg: {
      name: 'a-foo-module'
    }
  };

  // Arborist it self uses fixtures to make the life easy
  // so we are using fixtures as well.
  // https://github.com/npm/arborist/tree/main/test/fixtures
  const result = await resolvedPlugin(testEnv.pkg, '', '', 'test/fixtures');

  expect(result.length).toBe(1);
  expect(result[0].type).toBe('error');
  expect(result[0].reason).toContain('git');
});
