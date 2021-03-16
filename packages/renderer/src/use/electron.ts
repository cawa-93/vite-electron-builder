interface ElectronApi {
  readonly versions: Record<string, string>
}

export function useElectron(): Readonly<ElectronApi> {
  return (window as any).electron
}
