import {initApp} from '@vite-electron-builder/main';
import {fileURLToPath} from 'node:url';

if (process.env.NODE_ENV === 'development' || process.env.PLAYWRIGHT_TEST === 'true' || !!process.env.CI) {
  function showAndExit(...args) {
    console.error(...args);
    process.exit(1);
  }

  process.on('uncaughtException', showAndExit);
  process.on('unhandledRejection', showAndExit);
}

// noinspection JSIgnoredPromiseFromCall
/**
 * We resolve '@vite-electron-builder/renderer' and '@vite-electron-builder/preload'
 * here and not in '@vite-electron-builder/main'
 * to observe good practices of modular design.
 * This allows fewer dependencies and better separation of concerns in '@vite-electron-builder/main'.
 * Thus,
 * the main module remains simplistic and efficient
 * as it receives initialization instructions rather than direct module imports.
 */
initApp(
  {
    renderer: (process.env.MODE === 'development' && !!process.env.VITE_DEV_SERVER_URL) ?
      new URL(process.env.VITE_DEV_SERVER_URL)
      : {
        path: fileURLToPath(import.meta.resolve('@vite-electron-builder/renderer')),
      },

    preload: {
      path: fileURLToPath(import.meta.resolve('@vite-electron-builder/preload/exposed.mjs')),
    },
  },
);
