import fs from 'fs'
import path from 'path'

export class Factory {
  /**
   * setup whole the database factories from a given directory path
   * @param string factoriesDirectoryPath
   */
  static setupFactories ({ factoriesDirectoryPath, modelsPath }) {
    const factoryFilesList = fs.readdirSync(factoriesDirectoryPath)

    const { factory } = require('factory-girl')

    for (const factoryFile of factoryFilesList) {
      const factoryFilePath = path.resolve(factoriesDirectoryPath, factoryFile)
      const factoryModelFilePath = path.resolve(modelsPath, factoryFile)

      try {
        const factoryDefinitionContext = require(factoryFilePath)
        const factoryModelModule = require(factoryModelFilePath)
        const factoryModelModuleKeys = Object.keys(factoryModelModule)

        const factoryModel = factoryModelModule[factoryModelModuleKeys[0]]

        const factoryModelName = factoryModelModuleKeys[0]

        factory.define(
          factoryModelName,
          factoryModel,
          factoryDefinitionContext.default,
          factoryDefinitionContext.buildOptions || {}
        )
      } catch (e) {
      }
    }

    return factory
  }
}
