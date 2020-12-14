import {app, BrowserWindow} from 'electron'
import {join} from 'path'
import {format} from 'url'

let win: BrowserWindow | null = null

// Install "Vue.js devtools BETA"
if (import.meta.env.DEV) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension}) => {
      /** @see https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg */
      const VUE_DEVTOOLS_BETA = 'ljjemllljcmogpfapbkkighbhhppjdbg'
      return installExtension(VUE_DEVTOOLS_BETA)
    })
    .catch(e => console.error('Can not install extension:', e))
}

async function createWindow() {
  win = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  const URL = import.meta.env.DEV
    ? `http://localhost:3000`
    : format({
      protocol: 'file',
      pathname: join(__dirname, '../renderer/index.html'),
      slashes: true,
    })

  await win.loadURL(URL)
  win.maximize()
  win.show()

  if (import.meta.env.DEV) {
    win.webContents.openDevTools()
  }
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.whenReady()
  .then(createWindow)
  .catch((err) => console.error('Create window:', err))


// Auto-updates
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch((err) => console.error('Check updates:', err))
}
