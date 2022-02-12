import type {BinaryLike} from 'crypto';

declare global {
  interface Exposed {
    nodeCrypto: { sha256sum(data: BinaryLike): string };
  }
}
