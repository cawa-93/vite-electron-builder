import {AbstractSecurityRule} from './AbstractSecurityModule.js';
import * as Electron from 'electron';
import {URL} from 'node:url';
import type {Session} from 'electron';

export type Permission = Parameters<
  Exclude<Parameters<Session['setPermissionRequestHandler']>[0], null>
>[1];

/**
 * Block requests for disallowed permissions.
 * By default, Electron will automatically approve all permission requests.
 *
 * @see https://www.electronjs.org/docs/latest/tutorial/security#5-handle-session-permission-requests-from-remote-content
 */
class PermissionsForOrigin extends AbstractSecurityRule {

  readonly #origin: string;
  readonly #permissions: Set<Permission>;

  constructor(origin: string, permissions: Set<Permission>) {
    super();
    this.#origin = origin;
    this.#permissions = permissions;
  }

  applyRule(contents: Electron.WebContents): Promise<void> | void {

    contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
      const {origin} = new URL(webContents.getURL());

      if (origin !== this.#origin) {
        return;
      }

      const permissionGranted = this.#permissions.has(permission);
      callback(permissionGranted);

      if (!permissionGranted && import.meta.env.DEV) {
        console.warn(`${origin} requested permission for '${permission}', but was rejected.`);
      }
    });
  }
}

export function createPermissionsForOrigin(...args: ConstructorParameters<typeof PermissionsForOrigin>) {
  return new PermissionsForOrigin(...args);
}
