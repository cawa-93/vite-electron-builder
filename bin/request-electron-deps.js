/**
 * Temporally
 * @deprecated
 * @see https://github.com/electron/electron/issues/28006
 */


/**
 * @typedef Vendors
 * @type {{
 *   node: string,
 *   v8: string,
 *   uv: string,
 *   zlib: string,
 *   brotli: string,
 *   ares: string,
 *   modules: string,
 *   nghttp2: string,
 *   napi: string,
 *   llhttp: string,
 *   http_parser: string,
 *   openssl: string,
 *   cldr: string,
 *   icu: string,
 *   tz: string,
 *   unicode: string,
 *   electron: string,
 * }}
 */

/**
 *
 * @type {null | Vendors}
 */
let runtimeCache = null;

/**
 * Returns information about dependencies of the specified version of the electron
 * @return {Vendors}
 *
 * @see https://electronjs.org/headers/index.json
 */
const loadDeps = () => {
  const stringifiedDeps = require('child_process').execSync(
    'electron -p JSON.stringify(process.versions)',
    {
      encoding: 'utf-8',
      env: {
        ELECTRON_RUN_AS_NODE: '1',
      },
    },
  );

  return JSON.parse(stringifiedDeps);
};

const saveToCache = (dist) => {
  runtimeCache = dist;
};

/**
 *
 * @return {null|Vendors}
 */
const loadFromCache = () => runtimeCache;

/**
 *
 * @return {Vendors}
 */
const getElectronDist = () => {
  let dist = loadFromCache();

  if (dist) {
    return dist;
  }

  dist = loadDeps();

  saveToCache(dist);

  return dist;
};

const {node, modules} = getElectronDist();

module.exports.node = node;
module.exports.chrome = modules;//.split('.')[0];
