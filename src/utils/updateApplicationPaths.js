import fs from 'fs'
import path from 'path'

import config from '@asa/config'

import { getAppModules, isDir } from '.'

const appModulesInfo = {
  lastData: null,

  getAll () {
    return getAppModules()
  },

  changed () {
    const appModulesStr = JSON.stringify(this.getAll())

    const changed = Boolean(appModulesStr !== this.lastData)

    this.lastData = appModulesStr

    return changed
  }
}

function createDefaultModulePaths () {
  const appModules = getAppModules()

  const appDefaultModuleFolders = appModules[config.module] || []

  /**
   * @var object
   *
   * schema => {
   *  '@pathPrefix' => '{autoFill}/controllers/*'
   * }
   */
  const paths = {}

  for (const appDefaultModuleFolder of appDefaultModuleFolders) {
    paths[`@${appDefaultModuleFolder}/*`] = `${appDefaultModuleFolder}/*`
  }

  for (const key in paths) {
    const pathSource = [
      '.',
      'src',
      config.modulesDirName,
      config.module,
      paths[key]
    ]

    paths[key] = [
      pathSource.filter(pathSourceSlice => Boolean(pathSourceSlice)).join('/')
    ]
  }

  return paths
}

export function updateApplicationPaths () {
  const jsConfigFilePath = path.resolve(config.rootDir, '..', 'jsconfig.json')

  if (!(appModulesInfo.changed() && fs.existsSync(jsConfigFilePath))) {
    return
  }

  // function isDefaultModulePath (path) {
  //   const [pathSource] = path

  //   const defaultModulePathPrefixRe = new RegExp(`^(\\./src${(config.modulesDirRawName && `(/${config.modulesDirRawName})`) || ''}/${config.module}/.+)`)

  //   return defaultModulePathPrefixRe.test(pathSource)
  // }

  function isValidPathSource (pathSourceArray) {
    const [pathSource] = pathSourceArray
    const baseUrl = (typeof jsConfig.baseUrl === 'string' && jsConfig.baseUrl) || '.'
    const pathSourceDir = path.resolve(config.rootDir, '..', baseUrl, pathSource.replace(/(\/?\*)$/, ''))

    return isDir(pathSourceDir)
  }

  function moduleNameToRelativePath (moduleName) {
    const moduleRefArray = moduleName.split(/\s*:+\s*/)
    const moduleRefPath = moduleRefArray.map(moduleRefArraySlice => (
      [config.modulesDirName || '', moduleRefArraySlice].join(path.sep)
    ))

    return moduleRefPath.join(path.sep)
  }

  const jsConfig = require(jsConfigFilePath)

  if (typeof jsConfig.compilerOptions !== 'object') {
    jsConfig.compilerOptions = {}
  }

  const jsConfigPaths = jsConfig.compilerOptions.paths || {}
  const modulePathRe = /^(([a-zA-z0-9_\\$]+):@.+)/
  const appDefaultPaths = {}
  const defaultModulePaths = createDefaultModulePaths({ jsConfig })

  for (const pathKey in jsConfigPaths) {
    const path = jsConfigPaths[pathKey]

    if (!(modulePathRe.test(pathKey) || !isValidPathSource(path))) {
      appDefaultPaths[pathKey] = jsConfigPaths[pathKey]
    }
  }

  jsConfig.compilerOptions = {
    ...jsConfig.compilerOptions,

    paths: {
      ...appDefaultPaths,
      ...defaultModulePaths
    }
  }

  /**
   * @var object
   *
   * a map of the application modules
   *
   * object schema =>
   * {
   *   moduleName => [
   *    controllers,
   *    models,
   *    middlewares,
   *    helpers,
   *    services,
   *    ...
   *   ]
   * }
   */
  const appModules = appModulesInfo.getAll()

  for (const moduleName in appModules) {
    const module = appModules[moduleName]

    if (module instanceof Array) {
      module
        .filter(moduleFolder => typeof 'str' === typeof moduleFolder)
        .forEach(moduleFolder => {
          const moduleFolderPath = path.join(moduleNameToRelativePath(moduleName), moduleFolder)
          // module:@*
          if (moduleFolderPath) {
            jsConfig.compilerOptions.paths[`${moduleName}:@${moduleFolder}/*`] = [
              `./src/${moduleFolderPath}/*`
              // `./src${(config.modulesDirName && `/${config.modulesDirName}`) || ''}/${moduleName}/${moduleFolder}/*`
            ]
          }
        })
    }
  }

  const jsConfigStr = JSON.stringify(jsConfig, null, 2)

  try {
    fs.writeFileSync(jsConfigFilePath, jsConfigStr)

    console.info('Updated @root/jsconfig.json file')

    const moduleAliasSetupFilePath = path.resolve(config.rootDir, '..', 'vendor', 'console', 'setups', 'module-aliases.js')

    const { setupModuleAliases } = require(moduleAliasSetupFilePath)

    setupModuleAliases()
  } catch (err) {
  }
}
