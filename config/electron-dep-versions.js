const {readFileSync} = require('fs');
const {join} = require('path');
const lockJSON = readFileSync(join(process.cwd(), 'package-lock.json'), 'utf8');
const installedElectronVersion = JSON.parse(lockJSON).packages['node_modules/electron'].version;
const releases = require('electron-releases/lite.json');

const release = releases.find(r => r.version === installedElectronVersion);

if (!release) {
  throw new Error(`Can't find electron release info for version: ${installedElectronVersion}
  Try run:

  npm update electron-releases

  And try again`);
}

module.exports.chrome = release.deps.chrome.split('.')[0];
module.exports.node = release.deps.node;

