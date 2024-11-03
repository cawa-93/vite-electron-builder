import {sha256sum} from './nodeCrypto.js';
import {versions} from './versions.js';

console.log({
  sha256sum: sha256sum('sha256sum')
});

export {sha256sum, versions};
