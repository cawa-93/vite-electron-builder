import * as electron from 'electron';
import {expect, test, vi} from 'vitest';

vi.mock('electron', () => {
  return {
    BrowserWindow: vi.fn(),
  };
});

test('window', async () => {
  expect(vi.isMockFunction(electron.BrowserWindow)).toEqual(true);
});
