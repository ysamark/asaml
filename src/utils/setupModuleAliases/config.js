import path from 'path'

import { setupModuleAliases as setup } from '.'

export const setupModuleAliases = () => {
  setup({ rootDir: path.dirname(require.main.path) })
}

export default setupModuleAliases()
