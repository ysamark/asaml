import path from 'path'
import fs from 'fs/promises'

import { config } from '@asa'
import database from '@config/database'
import Adapters from './ModelDataObject/Adapters'

const setupDoneSymbol = Symbol('setupDone')

export class Helper {
  static corsOptions (corsOptions) {
    Object.keys(corsOptions).forEach(key => {
      const keyReader = `_readCors${Helper.title(key)}`

      if (typeof Helper[keyReader] === 'function') {
        corsOptions[key] = Helper[keyReader](corsOptions[key])
      }
    })

    return corsOptions
  }

  static _readCorsOrigin (origin) {
    if (origin instanceof Array) {
      return (requestOrigin, callback) => {
        if (origin.indexOf(requestOrigin) !== -1 || !requestOrigin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
    }

    return origin
  }

  static title (str) {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length)
  }

  static isEmail (data) {
    const re = /^(.+)@(.+)$/
    return typeof data === typeof 'str' && re.test(data)
  }

  static isClass (object) {
    return typeof object === 'function' && /^class/i.test(object.toString())
  }

  static async setupModels () {
    try {
      const modelsFileList = await fs.readdir(config.modelsPath)

      modelsFileList
        .filter(modelFile => !/^(AppModel\.js)$/.test(modelFile))
        .forEach(modelFile => {
          const modelFilePath = path.join(config.modelsPath, modelFile)

          const modelName = modelFile.replace(/\.js$/i, '')

          const modelModuleObject = require(modelFilePath)

          const modelClassObject = modelModuleObject[modelName]

          if (modelClassObject._registered) {
            return null
          }

          if (Helper.isClass(modelClassObject) &&
          typeof modelClassObject.registerModuleDataObject === 'function') {
          // console.log (modelClassObject)

            const modelAdapter = typeof modelClassObject.adapter === typeof 'str' ? modelClassObject.adapter : database.adapter

            if (Adapters.defined(modelAdapter)) {
              Adapters[modelAdapter].setupModel({
                modelClassObject,
                modelFile
              })
            }
          }
        })

      Helper[setupDoneSymbol] = true
    } catch (err) {
    }
  }

  static ModelsSetupDone () {
    return Boolean(Helper[setupDoneSymbol])
  }
}
