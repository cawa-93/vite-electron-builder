import type {AppInitConfig} from '/@/AppInitConfig.js';
import {BrowserWindow} from 'electron';

export function createWindowManager({
  preload,
  renderer,
}: Pick<AppInitConfig, 'preload' | 'renderer'>) {
  async function createWindow() {
    const browserWindow = new BrowserWindow({
      show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
        webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
        preload: preload.path,
      },
    });

    /**
     * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
     * it then defaults to 'true'.
     * This can cause flickering as the window loads the HTML content,
     * and it also has show problematic behavior with the closing of the window.
     * Use `show: false` and listen to the `ready-to-show` event to show the window.
     *
     * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
     */
    browserWindow.on('ready-to-show', () => {
      browserWindow?.show();

      if (import.meta.env.DEV) {
        browserWindow?.webContents.openDevTools();
      }
    });

    if (renderer instanceof URL) {
      await browserWindow.loadURL(renderer.href);
    } else {
      await browserWindow.loadFile(renderer.path);
    }

    return browserWindow;
  }

  /**
   * Restore an existing BrowserWindow or Create a new BrowserWindow.
   */
  async function restoreOrCreateWindow() {
    let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

    if (window === undefined) {
      window = await createWindow();
    }

    if (window.isMinimized()) {
      window.restore();
    }

    window.focus();
  }

  return {
    restoreOrCreateWindow,
  };
}
