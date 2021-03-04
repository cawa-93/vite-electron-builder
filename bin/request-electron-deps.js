const fs = require('fs');
const fetch = require('fetch');
const {version: installedElectronVersion} = require('electron/package.json');

/**
 * Data from the last tested versions of electron
 * @type {{node: string, chrome: string}}
 */
const FALLBACK_ELECTRON_DIST = {
  node: '12.18.3',
  chrome: '87.0.4280.141',
  version: '11.3.0',
};

const CACHE_FILE_PATH = '~/.cache/vite-electron-builder/electron-deps.json';

/**
 * Returns information about dependencies of the specified version of the electron
 * @return {Promise<{node: string, chrome: string}>}
 *
 * @see https://electronjs.org/headers/index.json
 */
const fetchElectronDeps = () => {
    return fetch('https://electronjs.org/headers/index.json')
    .then(r => r.json())
    .then((releases) => {
      const {node, chrome, version} = releases.find(dist => dist.version === installedElectronVersion);
      return {node, chrome, version};
    })
    .catch(err => {
      console.error('Can\'t find Electron dist', err || '', 'Will be used fallback data');
      return FALLBACK_ELECTRON_DIST;
    });
};

const saveToCache = (dist) => {
  return fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(dist), {encoding: 'utf-8'});
};

const loadFromCache = () => {
  if (!fs.existsSync(CACHE_FILE_PATH)) {
    return;
  }

  const cachedDist = JSON.parse(fs.readFileSync(CACHE_FILE_PATH, {encoding: 'utf-8'}));

  return cachedDist.version === installedElectronVersion ? cachedDist : undefined;
};

const getElectronDist = () => {
  const dist = loadFromCache();
  return dist || FALLBACK_ELECTRON_DIST;
};

fetchElectronDeps().then(saveToCache);

module.exports.getElectronDist = getElectronDist;
