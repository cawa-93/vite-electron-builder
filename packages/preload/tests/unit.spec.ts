import {createHash} from 'crypto';
import {describe, expect, test, vi} from 'vitest';
import * as exposed from '../dist/exposed.mjs';
import {contextBridge} from 'electron';
import {EXPOSED_PREFIX} from '../src/exposed-prefix';

vi.mock('electron', () => {
  return {
    contextBridge: {
      exposeInMainWorld: vi.fn(),
    },
  };
});

describe('All should be exposed', () => {
  for (const key in exposed) {
    test(key, () => {
      const {exposeInMainWorld} = vi.mocked(contextBridge);
      expect(exposeInMainWorld).toHaveBeenCalledWith(EXPOSED_PREFIX + key, exposed[key]);
    });
  }
});

test('Exposed versions should be equal to environment versions', async () => {
  expect(exposed.versions).toBe(process.versions);
});

test('Exposed nodeCrypto should be a function and return correct values', async () => {
  // Test hashing a random string.
  const testString = Math.random().toString(36).slice(2, 7);
  const expectedHash = createHash('sha256').update(testString).digest('hex');

  expect(exposed.sha256sum(testString)).toBe(expectedHash);
});
