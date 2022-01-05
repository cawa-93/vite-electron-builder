import {BrowserWindow} from 'electron';
import type {MockedObject} from 'vitest';
import {afterEach, expect, test, vi} from 'vitest';
import {restoreOrCreateWindow} from '../src/mainWindow';

const BrowserWindowMocked = BrowserWindow as MockedObject<typeof BrowserWindow>;


vi.mock('electron', () => {
  const bw = vi.fn(function () {
    this.on = vi.fn();
    this.destroy = vi.fn();
    this.loadURL = vi.fn();
    this.isDestroyed = vi.fn(() => false);
    this.isMinimized = vi.fn(() => false);
    this.focus = vi.fn();
    this.restore = vi.fn();
  });

  bw.getAllWindows = vi.fn();
  return {
    BrowserWindow: bw,
  };
});


afterEach(() => {
  BrowserWindowMocked.mockClear();
});

test('Should create new window', async () => {
  expect(BrowserWindowMocked.getAllWindows.mock.calls.length).toEqual(0);
  await restoreOrCreateWindow();
  expect(BrowserWindowMocked.mock.instances.length).toEqual(1);
  expect(BrowserWindowMocked.mock.instances[0].loadURL).toHaveBeenCalledTimes(1);
  expect(BrowserWindowMocked.mock.instances[0].loadURL.calls.length).toEqual(1);
});


test('Should restore existing window', async () => {
  expect(BrowserWindowMocked.mock.instances.length).toEqual(1);

  await restoreOrCreateWindow();
  expect(BrowserWindowMocked.mock.instances.length).toEqual(1);
  expect(BrowserWindowMocked.mock.instances[0].focus).toHaveBeenCalledTimes(1);

  BrowserWindowMocked.mock.instances[0].isMinimized.mockReturnValueOnce(true);
  await restoreOrCreateWindow();
  expect(BrowserWindowMocked.mock.instances[0].restore).toHaveBeenCalledTimes(1);
});


test('Should create new window if previous was destroyed', async () => {
  expect(BrowserWindowMocked.mock.instances.length).toEqual(1);
  BrowserWindowMocked.mock.instances[0].isDestroyed.mockReturnValueOnce(true);

  await restoreOrCreateWindow();
  expect(BrowserWindowMocked.mock.instances.length).toEqual(2);
});
