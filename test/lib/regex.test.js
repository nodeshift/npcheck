/* eslint-env jest */

const { escapeRegExp, matchLicenses } = require('../../src/lib/regex');

it('Should escape the license', () => {
  const response = escapeRegExp('MIT*');
  const expected = 'MIT\\*';
  expect(response).toBe(expected);
});

it('Should escape the license', () => {
  const response = escapeRegExp('MIT* OR Apache*');
  const expected = 'MIT\\* OR Apache\\*';
  expect(response).toBe(expected);
});

it('Should match the licenses.', () => {
  const response = matchLicenses('MIT', 'MIT');
  expect(response).toBe(true);
});

it('Should match the licenses.', () => {
  const response = matchLicenses('MIT*', 'MIT');
  expect(response).toBe(true);
});

it('Should match the licenses.', () => {
  const response = matchLicenses('MIT OR Apache-2.0', 'MIT');
  expect(response).toBe(true);
});

it('Should match the licenses.', () => {
  const response = matchLicenses('MIT* OR Apache*', 'MIT');
  expect(response).toBe(true);
});

it('Should not match the licenses.', () => {
  const response = matchLicenses('Apache-2.0', 'MIT');
  expect(response).toBe(false);
});

it('Should not match the licenses.', () => {
  const response = matchLicenses('AGPL', 'GPL');
  expect(response).toBe(false);
});
