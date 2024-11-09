import {AbstractSecurityRule} from './AbstractSecurityModule.js';
import * as Electron from 'electron';
import {URL} from 'node:url';

/**
 * Block navigation to origins not on the allowlist.
 *
 * Navigation exploits are quite common. If an attacker can convince the app to navigate away from its current page,
 * they can possibly force the app to open arbitrary web resources/websites on the web.
 *
 * @see https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
 */
export class BlockNotAllowedOrigins extends AbstractSecurityRule {
  readonly #allowedOrigins: Set<string>;

  constructor(allowedOrigins: Set<string> = new Set) {
    super();
    this.#allowedOrigins = structuredClone(allowedOrigins)
  }

  applyRule(contents: Electron.WebContents): Promise<void> | void {

    contents.on('will-navigate', (event, url) => {
      const {origin} = new URL(url);
      if (this.#allowedOrigins.has(origin)) {
        return;
      }

      // Prevent navigation
      event.preventDefault();

      if (import.meta.env.DEV) {
        console.warn(`Blocked navigating to disallowed origin: ${origin}`);
      }
    });
  }
}


export function allowInternalOrigins(...args: ConstructorParameters<typeof BlockNotAllowedOrigins>): BlockNotAllowedOrigins {
  return new BlockNotAllowedOrigins(...args);
}
