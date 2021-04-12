const {writeFile, readFile} = require('fs/promises')
const {execSync} = require('child_process')
const electron = require('electron')
/**
 * Returns versions of electron vendors
 * The performance of this feature is very poor and can be improved
 * @see https://github.com/electron/electron/issues/28006
 *
 * @returns {NodeJS.ProcessVersions}
 */
function getVendors() {
  const output = execSync(`${electron} -p "JSON.stringify(process.versions)"`, {
    env: {'ELECTRON_RUN_AS_NODE': '1'},
    encoding: 'utf-8',
  })

  return JSON.parse(output)
}


function formatedJSON(obj) {
  return JSON.stringify(obj, null, 2) + '\n'
}

function updateVendors() {
  const electronRelease = getVendors()

  const nodeMajorVersion = electronRelease.node.split('.')[0]
  const chromeMajorVersion = electronRelease.v8.split('.')[0] + electronRelease.v8.split('.')[1]

  return Promise.all([
    writeFile('./electron-vendors.config.json',
      formatedJSON({
        chrome: chromeMajorVersion,
        node: nodeMajorVersion,
      }),
    ),

    readFile('../package.json').then(JSON.parse).then((packageJson) => {
      if (!packageJson || !Array.isArray(packageJson.browserslist)) {
        throw new Error('Can\'t find browserslist in package.json')
      }

      packageJson.browserslist = [`Chrome ${chromeMajorVersion}`]

      return writeFile('../package.json', formatedJSON(packageJson))
    }),
  ])
}

updateVendors().catch(err => {
  console.error(err)
  process.exit(1)
})
