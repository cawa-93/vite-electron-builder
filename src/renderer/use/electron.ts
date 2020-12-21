import {ExposedInMainWorld} from '../../preload'
import apiKey from '../../preload/apiKey'

export function useElectron(): ExposedInMainWorld {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any)[apiKey] as ExposedInMainWorld
}
