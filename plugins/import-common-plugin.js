import {readFile} from 'fs/promises';

export default function importCommonPlugin(options) {
  const virtualModuleId = '#common';
  const resolvedVirtualModuleId = '\0' + virtualModuleId.replace('#', '@');

  return {
    name: 'import-common',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        if (!options?.commonEntry) {
          throw new Error(
            'Could not load common module, did you forget to set commonEntry in vite.config.ts?',
          );
        }
        return await readFile(options.commonEntry, 'utf-8');
      }
    },
  };
}
