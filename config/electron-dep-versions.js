const {version: installedElectronVersion} = require('electron/package.json');
const releases = require('electron-releases/lite.json');

const currentReleaseInfo = releases.find(r => r.version === installedElectronVersion);

if (!currentReleaseInfo) {
  throw new Error(`Can't find electron release info for version: ${installedElectronVersion}
  Try run:

  npm update electron-releases

  And try again`);
}

module.exports.chrome = currentReleaseInfo.deps.chrome.split('.')[0];
module.exports.node = currentReleaseInfo.deps.node;

