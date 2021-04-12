/* eslint-env jest */

const format = require('../../src/lib/format');

test('Should format the output messages.', () => {
  let output = '';
  const log = input => (output += `${input}`);
  console.log = jest.fn(log);

  const expected = 'msg1 PASS msg2 WARN msg3 FAIL ';
  format.success('msg1');
  format.warning('msg2');
  format.failure('msg3');
  expect(output).toBe(expected);
});
