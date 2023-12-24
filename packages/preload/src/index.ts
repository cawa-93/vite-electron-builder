/**
 * @module preload
 */

import {sha256sum} from './nodeCrypto';
import {versions} from './versions';
export {sha256sum, versions};

// TODO: Remove this workaround after unplugin-auto-expose will be fixed for ESM support
import {contextBridge} from 'electron';
contextBridge.exposeInMainWorld('__electron_preload__sha256sum', sha256sum);
contextBridge.exposeInMainWorld('__electron_preload__versions', versions);
