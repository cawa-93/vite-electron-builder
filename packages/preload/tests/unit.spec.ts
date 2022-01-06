import {sha256sum} from '../src/sha256sum';
import {expect, test} from 'vitest';
import {createHash} from 'crypto';

test('sha256sum', () => {
  const data = 'rawData';
  const expectedHash = createHash('sha256')
    .update(data)
    .digest('hex');

  expect(sha256sum(data)).toBe(expectedHash);
});
