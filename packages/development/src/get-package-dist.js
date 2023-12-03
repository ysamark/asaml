import path from 'path'

export function getPackageDist ({ packageDir }) {
  try {
    const rootDir = typeof 'str' === typeof packageDir ? packageDir : process.cwd()
    const packageJsonFilePath = path.resolve(rootDir, 'package.json')
    const packageJsonFile = require(packageJsonFilePath)

    if (packageJsonFile.dist instanceof Array) {
      return packageJsonFile.dist
    }
  } catch (err) {
  }

  return []
}
