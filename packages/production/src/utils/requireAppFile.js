import { resolveAppFilePath } from './resolveAppFilePath'

export function requireAppFile (appFile = null) {
  const filePath = resolveAppFilePath(appFile)

  if (filePath) {
    return require(filePath)
  }
}
