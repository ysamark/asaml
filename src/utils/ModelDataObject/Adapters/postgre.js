import path from 'path'
import mongoose from '@config/mongoose'

import config from '@config/index'

const mongooseProp = Symbol('mongoose')

export default class Mongo {
  [mongooseProp] = null

  constructor (mongoose) {
    this[mongooseProp] = mongoose
  }

  static setupModel ({ modelClassObject, modelFile }) {
    const modelSchemaFilePath = path.join(config.schemasPath, [modelFile.replace(/((Schema)?\.js)$/i, ''), 'js'].join('.'))
    const modelName = modelFile.replace(/\.js$/i, '')

    try {
      const modelSchemaObject = require(modelSchemaFilePath)
      const modelSchema = new mongoose.Schema(modelSchemaObject.default)

      Object.getOwnPropertyNames(modelClassObject).forEach(key => {
        const match = key.match(/^(post|pre)(.+)/i)

        if (match) {
          const [
            modelClassObjectMethodName,
            modelSchemaHookAdderMethodName /* pre, post */,
            modelSchemaHookName
          ] = match

          modelSchema[modelSchemaHookAdderMethodName.toLowerCase()](
            modelSchemaHookName.toLowerCase(),
            modelClassObject[modelClassObjectMethodName]
          )
        }
      })

      const modelDataObject = mongoose.model(modelName, modelSchema)

      modelClassObject.registerModuleDataObject(modelDataObject)
    } catch (err) {
      throw new Error(err)
    }
  }

  /*
    // CREATE
      async create () {}
    // READ
      async all () {}
      async findAll () {}
      async find () {}
      async read () {}
    // UPDATE
      async update () {}
      async updateById () {}
      async updateBy () {}
    // DELETE
      async delete () {}
      async deleteById () {}
      async deleteBy () {}
  */

  // CREATE
  async create () {}
  // READ
  async all () {}
  async findAll () {}
  async find () {}
  async read () {}
  // UPDATE
  async update () {}
  async updateById () {}
  async updateBy () {}
  // DELETE
  async delete () {}
  async deleteById () {}
  async deleteBy () {}
}