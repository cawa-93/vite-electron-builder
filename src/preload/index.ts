import {clipboard, contextBridge} from 'electron'

console.log(import.meta.env)

const api = {
  clipboard,
}

contextBridge.exposeInMainWorld('electron', api)
// try {
// } catch {
//   window.electron = api
// }
