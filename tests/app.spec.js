const {Application} = require('spectron')
const {strict: assert} = require('assert')
const {join} = require('path')

const app = new Application({
  path: require('electron'),
  requireName: 'electronRequire',
  args: [join(__dirname, '..')],
})

app.start()
  .then(async () => {
    const windowCount = await app.client.getWindowCount()
    assert.strictEqual(windowCount, 1, 'Main window not opened')
  })

  .then(async function () {
    // Get the window content
    const content = await app.client.$('#app')
    assert.notStrictEqual(await content.getHTML(), '<div id="app"></div>', 'Window content is empty')
  })

  .then(function () {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  .then(() => process.exit(0))

  .catch(async function (error) {
    console.error(error)
    if (app && app.isRunning()) {
      return app.stop()
    }
    process.exit(1)
  })

