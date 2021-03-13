import type {ExposedInMainWorld} from '../../../preload/src';

export function useElectron(): ExposedInMainWorld {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).electron as ExposedInMainWorld;
}
