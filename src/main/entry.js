const manifest = require('./manifest.json')
require('./' + manifest['index.js'])
try {
  require('electron-reloader')(module, {watchRenderer: 0})
} catch (_) {
}
