const path = require('path')
const moduleAlias = require('module-alias')
const { reset } = require('module-alias')

const { pathsToModuleAliases } = require('../console')

exports.setupModuleAliases = ({ rootDir }) => {
  reset()

  const jsConfigFilePath = path.resolve(rootDir, 'jsconfig.json')

  const { compilerOptions: { paths, baseUrl } = {} } = require(jsConfigFilePath)

  const aliasPaths = pathsToModuleAliases(paths, { prefix: baseUrl })

  Object.keys(aliasPaths).forEach((aliasPath) => {
    const aliasPathSource = typeof aliasPaths[aliasPath] !== typeof 'string'
      ? aliasPaths[aliasPath]
      : path.resolve(rootDir, aliasPaths[aliasPath])

    const aliasPathSourceValue = (typeof aliasPathSource === 'function')
      ? aliasPathSource({ rootDir })
      : aliasPathSource

    moduleAlias.addAlias(aliasPath, aliasPathSourceValue)
  })

  moduleAlias()
}
