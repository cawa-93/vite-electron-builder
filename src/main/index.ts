import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { format } from "url";

let win = null;



function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/entry.js'),
    },
  });

  const pathname = join(__dirname, '../renderer/index.html');


  const URL = import.meta.env.DEV
    ? `http://localhost:3000`
    : format({
      protocol: 'file',
      pathname,
      slashes: true,
    });

  win.loadURL(URL);
}



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.whenReady()
  .then(createWindow);
// .then(() => import('electron-updater'))
// .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify());

