import {contextBridge, ipcRenderer} from 'electron'

/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api = {
  data: ['foo', 'bar'],
  doThing: () => ipcRenderer.send('do-a-thing'),
} as const

export type ExposedInMainWorld = Readonly<typeof api>

if (import.meta.env.MODE !== 'test') {
  /**
   * The "Main World" is the JavaScript context that your main renderer code runs in.
   * By default, the page you load in your renderer executes code in this world.
   *
   * @see https://www.electronjs.org/docs/api/context-bridge
   */
  contextBridge.exposeInMainWorld('electron', api)
} else {

  /**
   * Recursively Object.freeze() on objects and functions
   * @see https://github.com/substack/deep-freeze
   * @param o Object on which to lock the attributes
   */
  function deepFreeze<T extends Record<string, any>>(o: T): Readonly<T> {
    Object.freeze(o)

    Object.getOwnPropertyNames(o).forEach(prop => {
      if (o.hasOwnProperty(prop)
        && o[prop] !== null
        && (typeof o[prop] === 'object' || typeof o[prop] === 'function')
        && !Object.isFrozen(o[prop])) {
        deepFreeze(o[prop])
      }
    })

    return o
  }

  deepFreeze(api)

  // @ts-expect-error https://github.com/electron-userland/spectron#node-integration
  window.electronRequire = require

  // @ts-expect-error https://github.com/electron-userland/spectron/issues/693#issuecomment-747872160
  window.electron = api
}
