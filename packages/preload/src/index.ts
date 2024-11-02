/**
 * @module preload
 */

import {sha256sum} from './nodeCrypto.js';
import {versions} from './versions.js';
import {ipcRenderer} from 'electron';

// This is a test to see if we can access the ipcRenderer from the preload script
console.log({ipcRenderer});

export {sha256sum, versions};
