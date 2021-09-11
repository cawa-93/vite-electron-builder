const {_electron: electron} = require('playwright');
const {strict: assert} = require('assert');

// Playwright has EXPERIMENTAL electron support.
(async () => {
  const electronApp = await electron.launch({args: ['.']});

  /**
   * App main window state
   * @type {{isVisible: boolean; isDevToolsOpened: boolean; isCrashed: boolean}}
   */
  const windowState = await electronApp.evaluate(({BrowserWindow}) => {
    const mainWindow = BrowserWindow.getAllWindows()[0];

    const getState = () => ({
      isVisible: mainWindow.isVisible(),
      isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
      isCrashed: mainWindow.webContents.isCrashed(),
    });

    return new Promise((resolve) => {
      if (mainWindow.isVisible()) {
        resolve(getState());
      } else
        mainWindow.once('ready-to-show', () => setTimeout(() => resolve(getState()), 0));
    });
  });

  // Check main window state
  assert.ok(windowState.isVisible, 'Main window not visible');
  assert.ok(!windowState.isDevToolsOpened, 'DevTools opened');
  assert.ok(!windowState.isCrashed, 'Window crashed');

  /**
   * Rendered Main window web-page
   * @type {Page}
   */
  const page = await electronApp.firstWindow();


  // Check web-page content
  const element = await page.$('#app', {strict: true});
  assert.notStrictEqual(element, null, 'Can\'t find root element');
  assert.notStrictEqual((await element.innerHTML()).trim(), '', 'Window content is empty');


  // Checking the framework.
  // It is assumed that on the main screen there is a `<button>` that changes its contents after clicking.
  const button = await page.$('button');
  const originalBtnText = await button.textContent();

  await button.click();
  const newBtnText = await button.textContent();

  assert.ok(originalBtnText !== newBtnText, 'The button did not change the contents after clicking');

  // Check Node api
  // It is assumed that on the page "/about"
  // there is an element in which the version of the electron is displayed in format `electron: vdd.dd.dd`.
  await Promise.all([
    page.waitForNavigation(), // Waits for the next navigation
    page.click('a[href*="/about"]'),
  ]);

  const electronVersionElement = await page.$('text=electron:');

  assert.notStrictEqual(element, null, 'Can\'t element with electron version');

  const renderedElectronVersion = (await electronVersionElement.innerText()).match(/v(\d+\.\d+\.\d+)$/)[1];
  const {electron: realElectronVersion} = await electronApp.evaluate(() => process.versions);

  assert.strictEqual(renderedElectronVersion, realElectronVersion);

  // Close app
  await electronApp.close();
})();
