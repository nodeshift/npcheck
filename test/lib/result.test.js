/* eslint-env jest */

const { createError, createWarning, merge } = require('../../src/lib/result');

it('should return an npcheck error result.', () => {
  const reason = 'TEST!';
  const response = createError(reason);

  const expected = {
    type: 'error',
    reason
  };

  expect(response).toStrictEqual(expected);
});

it('should return an npcheck warning result.', () => {
  const reason = 'TEST!';
  const response = createWarning(reason);

  const expected = {
    type: 'warning',
    reason
  };

  expect(response).toStrictEqual(expected);
});

it('should merge when no target is specified.', () => {
  const result = createError('TEST!');
  const response = merge(result, null);

  const expected = { type: 'error', reason: 'TEST!' };

  expect(response).toStrictEqual(expected);
});

it('should merge two arrays with results.', () => {
  const firstResult = [{ type: 'error', reason: 'TEST-1!' }];
  const secondResult = [{ type: 'error', reason: 'TEST-2!' }];
  const response = merge(firstResult, secondResult);

  const expected = [
    { type: 'error', reason: 'TEST-1!' },
    { type: 'error', reason: 'TEST-2!' }
  ];

  expect(response).toStrictEqual(expected);
});

it('should merge error result with array.', () => {
  const result = { type: 'error', reason: 'TEST-1!' };
  const resultArray = [{ type: 'error', reason: 'TEST-2!' }];
  const response = merge(resultArray, result);

  const expected = [
    { type: 'error', reason: 'TEST-2!' },
    { type: 'error', reason: 'TEST-1!' }
  ];

  expect(response).toStrictEqual(expected);
});
