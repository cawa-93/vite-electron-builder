import {createHash} from 'crypto';
import {afterAll, expect, test, vi} from 'vitest';
import {sha256sum, versions} from '../dist/index.mjs';
import {contextBridge} from 'electron';
vi.mock('electron', () => {
  return ({
    contextBridge: {
      exposeInMainWorld: vi.fn(),
    },
  });
});

afterAll(() => {
  vi.clearAllMocks();
});

test('versions', async () => {
  expect(versions).toBe(process.versions);
  const {exposeInMainWorld} = vi.mocked(contextBridge);
  expect(exposeInMainWorld).toHaveBeenCalledWith('__electron_preload__versions', versions);
});

test('nodeCrypto', async () => {
  // Test hashing a random string.
  const testString = Math.random().toString(36).slice(2, 7);
  const expectedHash = createHash('sha256').update(testString).digest('hex');

  expect(sha256sum(testString)).toBe(expectedHash);

  const {exposeInMainWorld} = vi.mocked(contextBridge);
  expect(exposeInMainWorld).toHaveBeenCalledWith('__electron_preload__sha256sum', sha256sum);
});
