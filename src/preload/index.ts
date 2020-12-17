import {ipcRenderer, contextBridge} from 'electron'

const api = {
  data: ['foo', 'bar'],
  doThing: () => ipcRenderer.send('do-a-thing')
}

export type ExposedInMainWorld = typeof api

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */
contextBridge.exposeInMainWorld('electron', api)

if (import.meta.env.MODE === 'test') {
  // @ts-expect-error The Electron helpers provided by Spectron require accessing the core Electron APIs in the renderer processes of your application. So, either your Electron application has nodeIntegration set to true or you'll need to expose a require window global to Spectron so it can access the core Electron APIs.
  window.electronRequire = require
}
