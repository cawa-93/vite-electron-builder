import {clipboard, contextBridge} from 'electron'

const api = {
  clipboard,
}

contextBridge.exposeInMainWorld('electron', api)

console.log(import.meta.env)

if (import.meta.env.MODE === 'test') {
  // @ts-expect-error The Electron helpers provided by Spectron require accessing the core Electron APIs in the renderer processes of your application. So, either your Electron application has nodeIntegration set to true or you'll need to expose a require window global to Spectron so it can access the core Electron APIs.
  window.electronRequire = require
}
