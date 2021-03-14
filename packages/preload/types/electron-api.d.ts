interface ElectronApi {
  readonly versions:  NodeJS.ProcessVersions
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
