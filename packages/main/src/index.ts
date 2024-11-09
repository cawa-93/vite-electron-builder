import type {AppInitConfig} from './AppInitConfig.js';
import {createModuleRunner} from './ModuleRunner.js';
import {createSingleInstanceApp} from './modules/SingleInstanceApp.js';
import {createWindowManagerModule} from './modules/WindowManager.js';
import {createApplicationTerminatorOnLastWindowCloseModule} from './modules/ApplicationTerminatorOnLastWindowClose.js';
import {createHardwareAccelerationModule} from './modules/HarfwareAccelerationModule.js';
import {createAutoUpdaterModule} from './modules/AutoUpdater.js';
import {createChromeDevToolsExtensionModule} from './modules/ChromeDevToolsExtension.js';
import {createBlockNotAllowedOrigins} from './modules/security/BlockNotAllowdOrigins.js';
import {createPermissionsForOrigin} from './modules/security/PermissionsForOrigin.js';
import {createExternalUrlsModule} from './modules/ExternalUrls.js';


// Used in packages/entry-point.js
export async function initApp(initConfig: AppInitConfig) {
  const moduleRunner = createModuleRunner()
    .enable(createWindowManagerModule({initConfig}))
    .enable(createSingleInstanceApp())
    .enable(createApplicationTerminatorOnLastWindowCloseModule())
    .enable(createHardwareAccelerationModule({enable: false}))
    .enable(createAutoUpdaterModule())
    .enable(createChromeDevToolsExtensionModule({extension: 'VUEJS3_DEVTOOLS'}))

    // Security
    .enable(createBlockNotAllowedOrigins(
      new Set(initConfig.renderer instanceof URL ? [initConfig.renderer.origin] : []),
    ));


  /**
   * Special rules for development mode
   */
  if (initConfig.renderer instanceof URL) {
    moduleRunner.enable(
      createPermissionsForOrigin(
        initConfig.renderer.origin,
        new Set(['openExternal']),
      ),
    )
      .enable(
        createExternalUrlsModule(
          new Set([
            'https://vite.dev',
            'https://developer.mozilla.org',
            'https://solidjs.com',
            'https://qwik.dev',
            'https://lit.dev',
            'https://react.dev',
            'https://preactjs.com',
            'https://www.typescriptlang.org',
            'https://vuejs.org',
          ]),
        ),
      );
  }
}
