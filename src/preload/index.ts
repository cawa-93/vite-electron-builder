import {ContextBridge, contextBridge, ipcRenderer} from 'electron'
import apiKey from '/@/apiKey'


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
  contextBridge.exposeInMainWorld(apiKey, api)


} else {
  type API = Parameters<ContextBridge['exposeInMainWorld']>[1]

  /**
   * Recursively Object.freeze() on objects and functions
   * @see https://github.com/substack/deep-freeze
   * @param obj Object on which to lock the attributes
   */
  function deepFreeze<T extends API>(obj: T): Readonly<T> {
    Object.freeze(obj)

    Object.getOwnPropertyNames(obj).forEach(prop => {
      if (obj.hasOwnProperty(prop)
        && obj[prop] !== null
        && (typeof obj[prop] === 'object' || typeof obj[prop] === 'function')
        && !Object.isFrozen(obj[prop])) {
        deepFreeze(obj[prop])
      }
    })

    return obj
  }

  deepFreeze(api)

  // @ts-expect-error https://github.com/electron-userland/spectron#node-integration
  window.electronRequire = require

  // @ts-expect-error https://github.com/electron-userland/spectron/issues/693#issuecomment-747872160
  window[apiKey] = api
}
