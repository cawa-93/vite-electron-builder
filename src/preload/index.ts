import {ContextBridge, contextBridge} from 'electron';

const apiKey = 'electron';

/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api = {
  versions: process.versions,
} as const;


export type ExposedInMainWorld = Readonly<typeof api>;


if (import.meta.env.MODE !== 'test') {

  /**
   * The "Main World" is the JavaScript context that your main renderer code runs in.
   * By default, the page you load in your renderer executes code in this world.
   *
   * @see https://www.electronjs.org/docs/api/context-bridge
   */
  contextBridge.exposeInMainWorld(apiKey, api);


} else {
  type API = Parameters<ContextBridge['exposeInMainWorld']>[1]

  /**
   * Recursively Object.freeze() on objects and functions
   * @see https://github.com/substack/deep-freeze
   * @param obj Object on which to lock the attributes
   */
  function deepFreeze<T extends API>(obj: T): Readonly<T> {
    Object.freeze(obj);

    Object.getOwnPropertyNames(obj).forEach(prop => {
      if (obj.hasOwnProperty(prop)
        && obj[prop] !== null
        && (typeof obj[prop] === 'object' || typeof obj[prop] === 'function')
        && !Object.isFrozen(obj[prop])) {
        deepFreeze(obj[prop]);
      }
    });

    return obj;
  }

  deepFreeze(api);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-var-requires
  (window as any).electronRequire = require;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any)[apiKey] = api;
}
