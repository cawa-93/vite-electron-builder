import {BrowserWindow} from 'electron';
import {join} from 'path';
import {URL} from 'url';

function restoreWindowOrThrow(window: BrowserWindow | null) {
  if (!canRestoreWindow(window)) {
    throw new Error('Main window can\'t be restored');
  }

  if (window.isMinimized()) window.restore();
  window.focus();
}

function canRestoreWindow(window: BrowserWindow | null): window is BrowserWindow {
  return window !== null && !window.isDestroyed();
}

async function createWindow() {
  const browserWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      nativeWindowOpen: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();


  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}

let mainWindow: BrowserWindow | null = null;

export async function restoreOrCreateWindow() {
  console.log({BrowserWindow});
  // If window already exist just show it
  if (canRestoreWindow(mainWindow)) {
    restoreWindowOrThrow(mainWindow);
    return;
  }

  mainWindow = await createWindow();
}
