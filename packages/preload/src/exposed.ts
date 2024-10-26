import * as exports from './index.js';
import {contextBridge} from 'electron';
import {EXPOSED_PREFIX} from './exposed-prefix.js';

const isExport = (key: string): key is keyof typeof exports => Object.hasOwn(exports, key);

for (const exportsKey in exports) {
  if (isExport(exportsKey)) {
    contextBridge.exposeInMainWorld(EXPOSED_PREFIX + exportsKey, exports[exportsKey]);
  }
}

// Re-export for tests
export * from './index.js';
