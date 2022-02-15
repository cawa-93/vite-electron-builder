/* eslint-disable @typescript-eslint/consistent-type-imports */

interface Exposed {
  nodeCrypto: typeof import('./src/nodeCrypto').nodeCrypto;
  versions: typeof import('./src/versions').versions;
}


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window extends Exposed {}
