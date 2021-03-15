interface ElectronApi {
  readonly versions: Record<string, string>
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
