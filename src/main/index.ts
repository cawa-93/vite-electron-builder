import {app, BrowserWindow} from 'electron'
import {join} from 'path'
import {format} from 'url'

console.log(import.meta.env)

let win = null

crash code stuff

const foo = 'bar'

const a = 13

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  const pathname = join(__dirname, '../renderer/index.html')


  const URL = import.meta.env.DEV
    ? `http://localhost:3000`
    : format({
      protocol: 'file',
      pathname,
      slashes: true,
    })

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
  .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())

