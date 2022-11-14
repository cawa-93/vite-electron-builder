import {readFileSync} from 'node:fs';

/**
 * Cache app version. Just to prevent multiple reading from fs
 * @type {null|string}
 */
let CACHED_VERSION = null;

/**
 * Entry function for get app version.
 * By default, it returns `version` from `package.json`, but you can implement any logic here
 * @return {string}
 */
export function getVersion(path) {
  if (CACHED_VERSION === null) {
    CACHED_VERSION = JSON.parse(readFileSync(path, {encoding: 'utf8'})).version;
  }
  return CACHED_VERSION;
}
