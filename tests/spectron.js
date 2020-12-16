const Application = require('spectron').Application
const assert = require('assert').strict
const path = require('path')

const app = new Application({
  path: path.resolve(process.cwd(), 'dist/app/win-unpacked/vite-electron-builder.exe'),
  requireName: 'electronRequire',
})

app.start()
  .then(async () => {
    const isVisible = await app.browserWindow.isVisible()
    assert.ok(isVisible, 'Main window not opened')
  })

  .then(async function () {
    // Get the window content
    await app.client.waitUntilWindowLoaded()
    const content = await app.client.$('#app')
    assert.notStrictEqual(await content.getHTML(), '<div id="app"></div>', 'Window content is empty')
  })

  .then(function () {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  .catch(function (error) {
    console.error(error)
    process.exit(1)
  })

