import path from 'path'

export function getPackageDist (options) {
  if (!(typeof options === 'object')) {
    options = {}
  }

  const { packageDir } = options

  try {
    const rootDir = typeof 'str' === typeof packageDir ? packageDir : process.cwd()
    const packageJsonFilePath = path.resolve(rootDir, 'package.json')
    const packageJsonFile = require(packageJsonFilePath)

    if (typeof packageJsonFile.dist === 'object' && packageJsonFile.dist.paths instanceof Array) {
      return packageJsonFile.dist.paths
    }
  } catch (err) {
  }

  return []
}
