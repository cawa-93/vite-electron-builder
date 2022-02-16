import {type BinaryLike, createHash} from 'crypto';
import {exposeInMainWorld} from './exposeInMainWorld';

function sha256sum(data: BinaryLike) {
  return createHash('sha256')
    .update(data)
    .digest('hex');
}

// Export for types in contracts.d.ts
export const nodeCrypto = {sha256sum} as const;

exposeInMainWorld('nodeCrypto', nodeCrypto);
