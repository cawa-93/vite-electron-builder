const https = require('https')
const electronVersion = require('../package-lock.json').dependencies['electron'].version
const {writeFile} = require('fs/promises')

function fetch(options) {
  return new Promise((resolve, reject) => {

    https.get(options, (resp) => {
      if (resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location !== undefined) {
        resolve(fetch(resp.headers.location))
        return
      }

      let data = ''

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk
      })

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data)
      })

    }).on('error', (err) => {
      reject(err)
    })
  })
}

fetch('https://electronjs.org/headers/index.json').then(response => {
  /** @type {NodeJS.ProcessVersions[]} */
  const releases = JSON.parse(response)

  const electronRelease = releases.find(r => r.version === electronVersion)

  if (!electronRelease) {
    throw new Error(`Can't find electron release by version: ${electronVersion}`)
  }

  const nodeMajorVersion = electronRelease.node.split('.')[0]
  const chromeMajorVersion = electronRelease.chrome.split('.')[0]

  return Promise.all([
    writeFile('./electron-vendors.config.json',
      JSON.stringify({
        chrome: chromeMajorVersion,
        node: nodeMajorVersion,
      }, null, 2) + '\n',
    ),

    writeFile('./.browserslistrc', `Chrome ${chromeMajorVersion}\n`),
  ])
}).catch(err => {
  console.error(err)
  process.exit(1)
})
