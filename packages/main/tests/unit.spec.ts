import type {JestMockCompatFn, MaybeMockedDeep} from 'vitest';
import {beforeEach, expect, test, vi} from 'vitest';
import {restoreOrCreateWindow} from '../src/mainWindow';

import {BrowserWindow} from 'electron';

type TBrowserWindowMocked =
  typeof BrowserWindow
  & JestMockCompatFn<ConstructorParameters<typeof BrowserWindow>, MaybeMockedDeep<BrowserWindow>>
/**
 * Mock real electron BrowserWindow API
 */
vi.mock('electron', () => {
  const bw = vi.fn() as TBrowserWindowMocked;
  bw.prototype.loadURL = vi.fn();
  bw.prototype.on = vi.fn();
  bw.prototype.destroy = vi.fn();
  bw.prototype.isDestroyed = vi.fn();
  bw.prototype.isMinimized = vi.fn();
  bw.prototype.focus = vi.fn();
  bw.prototype.restore = vi.fn();

  return {BrowserWindow: bw};
});


beforeEach(() => {
  vi.clearAllMocks();
});

const {mock} = vi.mocked(BrowserWindow as TBrowserWindowMocked);

test('Should create new window', async () => {
  expect(mock.instances.length).toBe(0);

  await restoreOrCreateWindow();
  expect(mock.instances.length).toBe(1);
  expect(mock.instances[0].loadURL).toHaveBeenCalledTimes(1);
});


test('Should restore existing window', async () => {
  expect(mock.instances.length).toBe(1);

  mock.instances[0].isMinimized.mockReturnValueOnce(true);
  await restoreOrCreateWindow();
  expect(mock.instances[0].focus).toHaveBeenCalledTimes(1);
  expect(mock.instances[0].restore).toHaveBeenCalledTimes(1);
});


test('Should create new window if previous was destroyed', async () => {
  expect(mock.instances.length).toBe(1);

  mock.instances[0].isDestroyed.mockReturnValueOnce(true);
  await restoreOrCreateWindow();
  expect(mock.instances.length).toEqual(2);
});
