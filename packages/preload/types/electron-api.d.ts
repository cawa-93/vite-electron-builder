interface ElectronApi {
  readonly versions: Readonly<Record<string, string>>
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
