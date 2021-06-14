/* eslint-env jest */

const fs = require('fs');
const format = require('../../src/lib/format');

jest.mock('fs');

afterEach(() => {
  jest.clearAllMocks();
});

it('should pad the provided string at the end.', () => {
  const response = format.stringBuilder('Hello, World!').withPadding(15);
  const expected = 'Hello, World!  ';

  expect(response.get()).toEqual(expected);
});

it('should append the output with the string "PASS".', () => {
  const output = 'Sample output!';
  const expected = `${output} PASS `;

  // Stubbing the console.log for this test
  let state = '';
  console.log = jest.fn((input) => (state += input));

  format.success(output);

  expect(state).toBe(expected);
});

it('should append the output with the string "WARN".', () => {
  const output = 'Sample output!';
  const expected = `${output} WARN `;

  // Stubbing the console.log for this test
  let state = '';
  console.log = jest.fn((input) => (state += input));

  format.warning(output);

  expect(state).toBe(expected);
});

it('should append the output with the string "FAIL".', () => {
  const output = 'Sample output!';
  const expected = `${output} FAIL `;

  // Stubbing the console.log for this test
  let state = '';
  console.log = jest.fn((input) => (state += input));

  format.failure(output);

  expect(state).toBe(expected);
});

it('should append the error log to the logs file.', () => {
  // mock implementation for fs.appendFileSync
  fs.appendFileSync.mockImplementation(() => {});
  format.createErrorLog('just a random error message.');

  expect(fs.appendFileSync).toHaveBeenCalled();
});
