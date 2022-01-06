import type {JestMockCompatFn, MockedObjectDeep} from 'vitest';
import {beforeEach, expect, test, vi} from 'vitest';
import {restoreOrCreateWindow} from '../src/mainWindow';

import {BrowserWindow} from 'electron';


type TBrowserWindowMocked =
  typeof BrowserWindow
  & MockedObjectDeep<typeof BrowserWindow>
  & JestMockCompatFn<ConstructorParameters<typeof BrowserWindow>, MockedObjectDeep<BrowserWindow>>;


/**
 * Mock real electron BrowserWindow API
 */
vi.mock('electron', (): { BrowserWindow: TBrowserWindowMocked } => {
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


/**
 * Helps TypeScript to understand mocking
 */
const BrowserWindowMocked = BrowserWindow as TBrowserWindowMocked;

beforeEach(() => {
  vi.clearAllMocks();
});

test('Should create new window', async () => {
  expect(BrowserWindowMocked.mock.instances.length).toBe(0);
  await restoreOrCreateWindow();
  expect(BrowserWindowMocked.mock.instances.length).toBe(1);
  expect(BrowserWindowMocked.mock.instances[0].loadURL).toHaveBeenCalledTimes(1);
});


test('Should restore existing window', async () => {
  expect(BrowserWindowMocked.mock.instances.length).toBe(1);

  BrowserWindowMocked.mock.instances[0].isMinimized.mockReturnValueOnce(true);
  await restoreOrCreateWindow();
  expect(BrowserWindowMocked.mock.instances[0].focus).toHaveBeenCalledTimes(1);
  expect(BrowserWindowMocked.mock.instances[0].restore).toHaveBeenCalledTimes(1);
});


test('Should create new window if previous was destroyed', async () => {
  expect(BrowserWindowMocked.mock.instances.length).toBe(1);
  BrowserWindowMocked.mock.instances[0].isDestroyed.mockReturnValueOnce(true);

  await restoreOrCreateWindow();
  expect(BrowserWindowMocked.mock.instances.length).toEqual(2);
});
