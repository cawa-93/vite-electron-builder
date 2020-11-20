import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { format } from "url";
// import {Configuration} from 'electron-builder'
let win = null;



function createWindow() {
  win = new BrowserWindow({
    // width: 330,
    // height: 700,
    maximizable: true,
    webPreferences: {
      contextIsolation: true,
    },
  });

  const pathname = join(__dirname, '../renderer/index.html')

  console.log({__dirname});
  console.log({pathname});

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
  .then(createWindow)
  // .then(() => import('electron-updater'))
  // .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify());

