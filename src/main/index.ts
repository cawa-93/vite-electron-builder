import {app, BrowserWindow} from 'electron';
import {join} from 'path';
import {format} from 'url';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {

  // Install "Vue.js devtools BETA"
  if (import.meta.env.MODE === 'development') {
    app.whenReady()
      .then(() => import('electron-devtools-installer'))
      .then(({default: installExtension}) => {
        /** @see https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg */
        const VUE_DEVTOOLS_BETA = 'ljjemllljcmogpfapbkkighbhhppjdbg';
        return installExtension(VUE_DEVTOOLS_BETA);
      })
      .catch(e => console.error('Failed install extension:', e));
  }

  let mainWindow: BrowserWindow | null = null;

  async function createWindow() {
    mainWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: import.meta.env.MODE !== 'test',   // Spectron tests can't work with contextIsolation: true
        enableRemoteModule: import.meta.env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
      },
    });

    const URL = import.meta.env.MODE === 'development'
      ? 'http://localhost:3000' // TODO: Vite server can run on a non-3000 port. Need to fix this
      : format({
        protocol: 'file',
        pathname: join(__dirname, '../renderer/index.html'),
        slashes: true,
      });

    await mainWindow.loadURL(URL);
    mainWindow.maximize();
    mainWindow.show();

    if (import.meta.env.MODE === 'development') {
      mainWindow.webContents.openDevTools();
    }
  }


  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });


  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });


  app.whenReady()
    .then(createWindow)
    .catch((e) => console.error('Failed create window:', e));


  // Auto-updates
  if (import.meta.env.PROD) {
    app.whenReady()
      .then(() => import('electron-updater'))
      .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
      .catch((e) => console.error('Failed check updates:', e));
  }
}
