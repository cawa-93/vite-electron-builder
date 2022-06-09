import {createHash} from 'crypto';
import {expect, test} from 'vitest';
import {versions, sha256sum} from '../src';

test('versions', async () => {
  expect(versions).toBe(process.versions);
});


test('nodeCrypto', async () => {
  /**
   * Random string to test hashing
   */
  const testString = Math.random().toString(36).slice(2, 7);
  const expectedHash = createHash('sha256')
    .update(testString)
    .digest('hex');

  expect(sha256sum(testString)).toBe(expectedHash);
});
