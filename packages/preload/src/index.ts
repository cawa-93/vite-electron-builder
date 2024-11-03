import {sha256sum} from './nodeCrypto.js';
import {versions} from './versions.js';
import {ipcRenderer} from 'electron';

function send(channel: string, message: string) {
  return ipcRenderer.invoke(channel, message);
}

export {sha256sum, versions, send};
