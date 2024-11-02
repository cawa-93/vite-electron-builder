import type {ElectronApplication, JSHandle} from 'playwright';
import {_electron as electron} from 'playwright';
import {expect, test} from '@playwright/test';
import type {BrowserWindow} from 'electron';
import {globSync} from 'glob';
import {platform} from 'node:process';

let electronApp: ElectronApplication;

let executablePattern = 'dist/*/@vite-electron-builderroot{,.*}';
if (platform === 'darwin') {
  executablePattern += '/Contents/MacOS/@vite-electron-builderroot';
}


const executablePath = globSync(executablePattern);
console.log({
  executablePath,
});

if (!executablePath) {
  console.dir({
    executablePattern,
    executablePath,
    files: globSync('dist/*'),
    platform: process.platform,
  });
  throw new Error('App Executable path not found');
}

test.beforeAll(async () => {
  electronApp = await electron.launch({
    executablePath: executablePath[0],
  });
});

// test.afterAll(async () => {
//   await electronApp.close();
// });


test('Main window state', async () => {
  const page = await electronApp.firstWindow();
  const window: JSHandle<BrowserWindow> = await electronApp.browserWindow(page);
  const windowState = await window.evaluate(
    (mainWindow): Promise<{isVisible: boolean; isDevToolsOpened: boolean; isCrashed: boolean}> => {
      const getState = () => ({
        isVisible: mainWindow.isVisible(),
        isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
        isCrashed: mainWindow.webContents.isCrashed(),
      });

      return new Promise(resolve => {
        /**
         * The main window is created hidden, and is shown only when it is ready.
         * See {@link ../packages/main/src/mainWindow.ts} function
         */
        if (mainWindow.isVisible()) {
          resolve(getState());
        } else {
          mainWindow.once('ready-to-show', () => resolve(getState()));
        }
      });
    },
  );

  expect(windowState.isCrashed, 'The app has crashed').toEqual(false);
  expect(windowState.isVisible, 'The main window was not visible').toEqual(true);
  expect(windowState.isDevToolsOpened, 'The DevTools panel was open').toEqual(false);
});

test('Main window web content', async () => {
  const page = await electronApp.firstWindow();
  const element = page.getByRole('button');
  await expect(element).toBeVisible();
  await expect(element).toHaveText('count is 0');

  await element.click();

  await expect(element).toHaveText('count is 1');
});

test('Preload context should be exposed', async () => {
  const page = await electronApp.firstWindow();
  const expectedContext = await import('@vite-electron-builder/preload');
  await page.waitForLoadState();

  for (const key in expectedContext) {
    const globalVar = btoa(key);
    expect(await page.evaluate((key) => typeof window[key], globalVar),
      `${key} should be exposed into renderer context as globalThis["${globalVar}"]`,
    )
      .not.toEqual('undefined');

  }
});
