import {AppModule} from '../AppModule.js';
import {ModuleContext} from '../ModuleContext.js';
import installer from 'electron-devtools-installer';

const {
  REDUX_DEVTOOLS,
  VUEJS_DEVTOOLS,
  VUEJS3_DEVTOOLS,
  EMBER_INSPECTOR,
  BACKBONE_DEBUGGER,
  REACT_DEVELOPER_TOOLS,
  APOLLO_DEVELOPER_TOOLS,
  JQUERY_DEBUGGER,
  ANGULARJS_BATARANG,
  MOBX_DEVTOOLS,
  CYCLEJS_DEVTOOL,
  default: installExtension,
} = installer;

const extensionsDictionary = {
  REDUX_DEVTOOLS,
  VUEJS_DEVTOOLS,
  VUEJS3_DEVTOOLS,
  EMBER_INSPECTOR,
  BACKBONE_DEBUGGER,
  REACT_DEVELOPER_TOOLS,
  APOLLO_DEVELOPER_TOOLS,
  JQUERY_DEBUGGER,
  ANGULARJS_BATARANG,
  MOBX_DEVTOOLS,
  CYCLEJS_DEVTOOL,
} as const;

export class ChromeDevToolsExtension implements AppModule {
  readonly #extension: keyof typeof extensionsDictionary;

  constructor({extension}: {readonly extension: keyof typeof extensionsDictionary}) {
    this.#extension = extension;
  }

  async enable({app}: ModuleContext): Promise<void> {
    await app.whenReady();
    await installExtension(extensionsDictionary[this.#extension]);
  }
}

export function chromeDevToolsExtension(...args: ConstructorParameters<typeof ChromeDevToolsExtension>) {
  return new ChromeDevToolsExtension(...args);
}
