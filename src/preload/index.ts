import {clipboard, contextBridge} from 'electron'

const api = {
  clipboard,
}

contextBridge.exposeInMainWorld('electron', api)
// try {
// } catch {
//   window.electron = api
// }
