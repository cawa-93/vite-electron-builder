/**
 * The `EXPOSED_PREFIX` is a constant used when exposing variables in the main world
 * by the `exposeInMainWorld` function in the `@electron/remote` module in Electron applications.
 *
 * In Electron, web pages can run code in two types of worlds:
 * the main world and an isolated world.
 * The scripts running in the main world have access to the `document` object
 * and can make changes to the DOM,
 * while scripts running in the isolated world cannot make changes to the DOM directly.
 *
 * This isolation is crucial for security reasons,
 * especially when executing scripts from untrusted sources.
 * However, there might be occasions where you need to expose some APIs to the isolated world.
 *
 * In this case, we use `exposeInMainWorld` to safely expose these APIs.
 * This function will add the APIs to the `window` object of the main world,
 * making them accessible from the isolated world.
 *
 * ## Usage
 * ```typescript
 * contextBridge.exposeInMainWorld(EXPOSED_PREFIX + 'myCustomAPI', myCustomAPI);
 * ```
 *
 * The `EXPOSED_PREFIX` is a string constant,
 * which acts as a namespace or a prefix to isolate all the exposed vars.
 * By prefixing all exposed variables with `EXPOSED_PREFIX`,
 * we can avoid potential naming conflicts and accidental overrides of existing variables in the main world.
 *
 * When using `EXPOSED_PREFIX`, it is advisable to choose a unique
 * and somewhat complex name to lower the chances of any conflicts with other variable names.
 * You should also avoid exposing more global variables than necessary to maintain the isolation
 * and security that the context separation provides.
 */
export const EXPOSED_PREFIX = '__vite_electron_builder_exposed__';
