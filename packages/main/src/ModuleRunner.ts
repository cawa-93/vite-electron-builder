import {AppModule} from './AppModule.js';
import {ModuleContext} from './ModuleContext.js';
import {app} from 'electron';

class ModuleRunner implements PromiseLike<void> {
  #promise: Promise<void>;

  constructor() {
    this.#promise = Promise.resolve();
  }

  then<TResult1 = void, TResult2 = never>(onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
        return this.#promise.then(onfulfilled, onrejected);
    }

  init(module: AppModule) {
    const p = module.enable(this.#createModuleContext());

    if (p instanceof Promise) {
      this.#promise = this.#promise.then(() => p);
    }

    return this;
  }

  #createModuleContext(): ModuleContext {
    return {
      app,
    };
  }
}

export function createModuleRunner() {
  return new ModuleRunner();
}
