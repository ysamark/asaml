import path from 'path'

import { config } from '@asa'
import { isFile } from '@utils'

export function resolveAppFilePath (appFile = null) {
  appFile = appFile.replace(/(\.(j|t)s)$/, '')

  const appFileAbsolutePathAlternates = [
    path.join(config.rootDir, `${appFile}.js`),
    path.join(config.rootDir, `${appFile}.ts`)
  ]

  for (const appFileAbsolutePathAlternate of appFileAbsolutePathAlternates) {
    if (isFile(appFileAbsolutePathAlternate)) {
      return appFileAbsolutePathAlternate
    }
  }
}
