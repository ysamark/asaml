import fs from 'fs'
import path from 'path'

import { config } from '@asa'

export { Helper } from './Helper'
export { Factory } from './Factory'
export { loadSetupHandlers } from './loadSetupHandlers'
export { updateApplicationPaths } from './updateApplicationPaths'
export { initApplicationConfig } from './initApplicationConfig'

function getModulesFolders (modulePath) {
  let moduleDirectory = null
  let moduleDirectoryFolders = [1]

  try {
    moduleDirectory = fs.readdirSync(modulePath)
    moduleDirectoryFolders = Array.from(moduleDirectory).filter(moduleDirectoryFolder => {
      const moduleDirectoryFolderPath = path.join(modulePath, moduleDirectoryFolder)
      return isDir(moduleDirectoryFolderPath)
    })
    // moduleDirectory.closeSync()
  } catch (e) {
  }

  return moduleDirectoryFolders
}

export const isDir = dirPath => {
  if (dirPath instanceof Array) {
    dirPath = dirPath.join(path.sep)
  }

  if (fs.existsSync(dirPath)) {
    let dir

    try {
      dir = fs.opendirSync(dirPath)

      return true
    } catch (err) {

    } finally {
      dir?.closeSync()
    }
  }

  return false
}

export const isFile = filePath => {
  if (filePath instanceof Array) {
    filePath = filePath.join(path.sep)
  }

  if (fs.existsSync(filePath)) {
    try {
      fs.readFileSync(filePath)

      return true
    } catch (err) {
      return false
    }
  }

  return false
}

export const isClass = object => Boolean(
  typeof object === 'function' && /^class/i.test(object.toString())
)

export const getAppModules = () => {
  const modules = {}

  modules[config.module] = getModulesFolders(config.defaultModuleDir)

  if (!config.modulesDirExists()) {
    return modules
  }

  const getDirectoryModules = ({ modulesDirectoryPath, moduleKeyPrefix = null }) => {
    let modulesDirectory

    try {
      modulesDirectory = fs.readdirSync(modulesDirectoryPath)

      Array.from(modulesDirectory)
        .forEach(module => {
          const modulePath = path.resolve(modulesDirectoryPath, module)

          const innerModuleKeyPrefix = [moduleKeyPrefix, module].filter(prefix => Boolean(prefix)).join(':')

          if (isDir(modulePath)) {
            const moduleModulesDirectoryPath = path.resolve(modulePath, config.modulesDirName)

            modules[innerModuleKeyPrefix] = getModulesFolders(modulePath)

            if (isDir(moduleModulesDirectoryPath)) {
              getDirectoryModules({
                modulesDirectoryPath: moduleModulesDirectoryPath,
                moduleKeyPrefix: innerModuleKeyPrefix
              })
            }
          }
        })
    } catch (err) {
    } finally {
      const modulesDirectoryStillOpened = Boolean(
        modulesDirectory &&
        typeof modulesDirectory.closeSync === 'function'
      )

      if (modulesDirectoryStillOpened) {
        modulesDirectory.closeSync()
      }
    }
  }

  const modulesDirectoryPath = path.resolve(config.rootDir, config.modulesDirName)

  getDirectoryModules({ modulesDirectoryPath })

  return modules
}

export const getFileLastModify = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath)

    return fileContent.toString().split(/\s+/).join('')
  } catch (e) {
    return false
  }
}

export const capitalize = (str) => {
  if (typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length)
  }
}

export const moduleRefToPath = (moduleRef) => (
  moduleRef
    .split(/\s*:+\s*/)
    .map(slice => `/${slice}`)
    .join('')
)

export const usePathPrefix = (joined) => {
  return joined.join('/').split(/\/+/).join('/')
}

export const mergeObjects = (...objects) => {
  objects = objects.filter(object => typeof object === 'object')

  const mergedObjects = {}

  for (const object of objects) {
    // now, map whole the current object keys
    for (const key in object) {
      mergedObjects[key] = object[key]
    }
  }

  return mergeObjects
}

export const joinSourcePaths = (...paths) => {
  return paths
    .filter(path => typeof path === 'string' && /\S/.test(path))
    .join(':')
}
