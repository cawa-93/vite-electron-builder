const now = new Date;
const buildVersion = `${now.getFullYear() - 2000}.${now.getMonth() + 1}.${now.getDate()}`;

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist/app',
    buildResources: 'build',
  },
  files: [
    'dist/source/**',
  ],
  extraMetadata: {
    version: buildVersion,
  },
};

module.exports = config;
