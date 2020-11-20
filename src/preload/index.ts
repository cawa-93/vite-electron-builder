import { clipboard, contextBridge, shell } from "electron";

const api = {
  shell,
  clipboard,
}

contextBridge.exposeInMainWorld('electron', api)
// try {
// } catch {
//   window.electron = api
// }
