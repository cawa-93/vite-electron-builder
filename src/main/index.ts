import { join } from 'path'
import { app, BrowserWindow } from 'electron'

let win = null

function createWindow() {
  win = new BrowserWindow({
    width: 330,
    height: 700,
    webPreferences: {
      contextIsolation: true,
    },
  })

  const URL = import.meta.env.DEV
    ? `http://localhost:3000`
    : `file://${join(__dirname, '../../render/index.html')}`

  win.loadURL(URL)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.whenReady()
  .then(createWindow)
  .then(() => import('electron-updater'))
  .then(({autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())

