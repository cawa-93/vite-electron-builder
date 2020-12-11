/**
 *
 * @type {import('electron-builder').Configuration}
 */
module.exports = {
  directories: {
    output: 'dist/app',
    buildResources: 'build'
  },
  electronDownload: {
    cache: './.cache/electron'
  }
}
