interface ElectronApi {
  readonly versions: Readonly<Record<string, string>> & { [Symbol.iterator](): IterableIterator<Record<string, string>> }
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
