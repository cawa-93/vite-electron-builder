#!/usr/bin/env node

import {build, createLogger, createServer} from 'vite';
import electronPath from 'electron';
import {spawn} from 'child_process';


/** @type 'production' | 'development'' */
const mode = process.env.MODE = process.env.MODE || 'development';


/** @type {import('vite').LogLevel} */
const logLevel = 'warn';


/** Messages on stderr that match any of the contained patterns will be stripped from output */
const stderrFilterPatterns = [
  /**
   * warning about devtools extension
   * @see https://github.com/cawa-93/vite-electron-builder/issues/492
   * @see https://github.com/MarshallOfSound/electron-devtools-installer/issues/143
   */
  /ExtensionLoadWarning/,
];


/**
 * Setup watcher for `main` package
 * On file changed it totally re-launch electron app.
 * @param {import('vite').ViteDevServer} watchServer Renderer watch server instance.
 * Needs to set up `VITE_DEV_SERVER_URL` environment variable from {@link import('vite').ViteDevServer.resolvedUrls}
 */
function setupMainPackageWatcher({resolvedUrls}) {
  process.env.VITE_DEV_SERVER_URL = resolvedUrls.local[0];

  const logger = createLogger(logLevel, {
    prefix: '[main]',
  });

  /** @type {ChildProcessWithoutNullStreams | null} */
  let electronApp = null;

  return build({
    mode,
    logLevel,
    configFile: 'packages/main/vite.config.js',
    build: {
      /**
       * Set to {} to enable rollup watcher
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [{
      name: 'reload-app-on-main-package-change',
      writeBundle() {
        /** Kill electron ff process already exist */
        if (electronApp !== null) {
          electronApp.removeListener('exit', process.exit);
          electronApp.kill('SIGINT');
          electronApp = null;
        }

        /** Spawn new electron process */
        electronApp = spawn(String(electronPath), ['.']);

        /** Proxy all logs */
        electronApp.stdout.on('data', d => d.toString().trim() && logger.warn(d.toString(), {timestamp: true}));

        /** Proxy error logs but stripe some noisy messages. See {@link stderrFilterPatterns} */
        electronApp.stderr.on('data', d => {
          const data = d.toString().trim();
          if (!data) return;
          const mayIgnore = stderrFilterPatterns.some((r) => r.test(data));
          if (mayIgnore) return;
          logger.error(data, {timestamp: true});
        });

        /** Stops the watch script when the application has been quit */
        electronApp.addListener('exit', process.exit);
      },
    }],
  });

}


/**
 * Setup watcher for `preload` package
 * On file changed it reload web page.
 * @param {import('vite').ViteDevServer} watchServer Renderer watch server instance.
 * Required to access the web socket of the page. By sending the `full-reload` command to the socket, it reloads the web page.
 */
function setupPreloadPackageWatcher({ws}) {
  return build({
    mode,
    logLevel,
    configFile: 'packages/preload/vite.config.js',
    build: {
      /**
       * Set to {} to enable rollup watcher
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [{
      name: 'reload-page-on-preload-package-change',
      writeBundle() {
        ws.send({
          type: 'full-reload',
        });
      },
    }],
  });
}


/**
 * Dev server for Renderer package
 * This must be the first,
 * because the {@link setupMainPackageWatcher} and {@link setupPreloadPackageWatcher}
 * depend on the dev server properties
 */
const rendererWatchServer = await createServer({
  mode,
  logLevel,
  configFile: 'packages/renderer/vite.config.js',
})
  .then(s => s.listen());

await setupPreloadPackageWatcher(rendererWatchServer);
await setupMainPackageWatcher(rendererWatchServer);
