# @vite-electron-builder/electron-versions

## Description

A set of helper functions to get the versions of internal components bundled within Electron.

## Installation

To install this package, use the following command:

```bash
npm install -D @vite-electron-builder/electron-versions
```

## Usage

Import the functions you need from the package:

```javascript
import {
  getElectronVersions,
  getChromeVersion,
  getNodeVersion,
  getChromeMajorVersion,
  getNodeMajorVersion
} from '@vite-electron-builder/electron-versions';

// Example usage
console.log('Electron Versions:', getElectronVersions());
console.log('Chromium Version:', getChromeVersion());
console.log('Node.js Version:', getNodeVersion());
console.log('Chromium Major Version:', getChromeMajorVersion());
console.log('Node.js Major Version:', getNodeMajorVersion());
```

## API

- **getElectronVersions()**: Returns an object containing the versions of the internal components bundled within Electron.
- **getChromeVersion()**: Returns the version of Chromium bundled within Electron.
- **getChromeMajorVersion()**: Returns the major version number of Chromium bundled within Electron.
- **getNodeVersion()**: Returns the version of Node.js bundled within Electron.
- **getNodeMajorVersion()**: Returns the major version number of Node.js bundled within Electron.

## Example

An example of how you might use this package in a Vite configuration:

```javascript
import { getChromeMajorVersion } from '@vite-electron-builder/electron-versions';

export default {
  build: {
    target: `chrome${getChromeMajorVersion()}`,
    // other Vite configurations...
  },
  // other configurations...
};
```

### Explanation of `target`

The `target` parameter in Vite specifies the browser or environment versions that the output should be compatible with. In the provided example, `target: chrome${getChromeMajorVersion()}` ensures that the build output is compatible with the specific major version of Chromium that is bundled with your Electron application. This can help optimize the final bundle and ensure compatibility within the Electron environment.

## License

MIT
