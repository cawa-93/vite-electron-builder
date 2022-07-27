import type {Constructable, Mocked, MockInstance} from 'vitest';
import {beforeEach, expect, test, vi} from 'vitest';
import {restoreOrCreateWindow} from '../src/mainWindow';

import {BrowserWindow} from 'electron';

/**
 * Manual fix of MockedClass type
 * See https://github.com/vitest-dev/vitest/issues/1730
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockedClass<T extends Constructable> = MockInstance<T extends new (...args: infer P) => any ? P : never, InstanceType<T>> & {
  prototype: T extends {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prototype: any;
  } ? Mocked<T['prototype']> : never;
} & T;

/**
 * Mock real electron BrowserWindow API
 */
vi.mock('electron', () => {

  // Use "as unknown as" because vi.fn() does not have static methods
  const bw = vi.fn() as unknown as MockedClass<typeof BrowserWindow>;
  bw.getAllWindows = vi.fn(() => bw.mock.instances);
  bw.prototype.loadURL = vi.fn();
  // Use "any" because the on function is overloaded
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bw.prototype.on = vi.fn<any>();
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


test('Should create new window', async () => {
  const {mock} = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(1);
  expect(mock.instances[0].loadURL).toHaveBeenCalledOnce();
  expect(mock.instances[0].loadURL).toHaveBeenCalledWith(expect.stringMatching(/index\.html$/));
});


test('Should restore existing window', async () => {
  const {mock} = vi.mocked(BrowserWindow);

  // Create Window and minimize it
  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(1);
  const appWindow = vi.mocked(mock.instances[0]);
  appWindow.isMinimized.mockReturnValueOnce(true);

  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(1);
  expect(appWindow.restore).toHaveBeenCalledOnce();
});


test('Should create new window if previous was destroyed', async () => {
  const {mock} = vi.mocked(BrowserWindow);

  // Create Window and destroy it
  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(1);
  const appWindow = vi.mocked(mock.instances[0]);
  appWindow.isDestroyed.mockReturnValueOnce(true);

  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(2);
});
