import {app} from 'electron';
import './security-restrictions';
import {platform} from 'node:process';
import type {AppInitConfig} from './AppInitConfig.js';
import {createWindowManager} from './createWindowManager.js';
import {runAutoUpdater} from './auto-updater.js';

// Used in packages/entry-point.js
export function initApp(initConfig: AppInitConfig) {
  const {restoreOrCreateWindow} = createWindowManager({
    preload: initConfig.preload,
    renderer: initConfig.renderer,
  });

  /**
   * Prevent electron from running multiple instances.
   */
  const isSingleInstance = app.requestSingleInstanceLock();
  if (!isSingleInstance) {
    app.quit();
    process.exit(0);
  }
  app.on('second-instance', restoreOrCreateWindow);

  /**
   * Disable Hardware Acceleration to save more system resources.
   */
  app.disableHardwareAcceleration();

  /**
   * Shout down background process if all windows was closed
   */
  app.on('window-all-closed', () => {
    if (platform !== 'darwin') {
      app.quit();
    }
  });

  /**
   * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
   */
  app.on('activate', restoreOrCreateWindow);

  /**
   * Create the application window when the background process is ready.
   */
  app
    .whenReady()
    .then(restoreOrCreateWindow)
    .catch(e => console.error('Failed create window:', e));

  /**
   * Install any extension in development mode only.
   * Note: You must install `electron-devtools-installer` manually
   */
  // if (import.meta.env.DEV) {
  //   app
  //     .whenReady()
  //     .then(() => import('electron-devtools-installer'))
  //     .then(module => {
  //       const {default: installExtension, VUEJS_DEVTOOLS} =
  //         //@ts-expect-error Hotfix for https://github.com/cawa-93/vite-electron-builder/issues/915
  //         typeof module.default === 'function' ? module : (module.default as typeof module);
  //
  //       return installExtension(VUEJS_DEVTOOLS, {
  //         loadExtensionOptions: {
  //           allowFileAccess: true,
  //         },
  //       });
  //     })
  //     .catch(e => console.error('Failed install extension:', e));
  // }

  runAutoUpdater();
}
