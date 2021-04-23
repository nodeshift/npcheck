/* eslint-env jest */

const { escapeRegExp, matchLicenses } = require('../src/lib/regex');

test('Should escape the license', () => {
  const got = escapeRegExp('MIT*');
  const want = 'MIT\\*';
  expect(got).toBe(want);
});

test('Should escape the license', () => {
  const got = escapeRegExp('MIT* OR Apache*');
  const want = 'MIT\\* OR Apache\\*';
  expect(got).toBe(want);
});

test('Should match the licenses.', () => {
  const got = matchLicenses('MIT', 'MIT');
  expect(got).toBe(true);
});

test('Should match the licenses.', () => {
  const got = matchLicenses('MIT*', 'MIT');
  expect(got).toBe(true);
});

test('Should match the licenses.', () => {
  const got = matchLicenses('MIT OR Apache-2.0', 'MIT');
  expect(got).toBe(true);
});

test('Should match the licenses.', () => {
  const got = matchLicenses('MIT* OR Apache*', 'MIT');
  expect(got).toBe(true);
});

test('Should not match the licenses.', () => {
  const got = matchLicenses('Apache-2.0', 'MIT');
  expect(got).toBe(false);
});

test('Should not match the licenses.', () => {
  const got = matchLicenses('AGPL', 'GPL');
  expect(got).toBe(false);
});
