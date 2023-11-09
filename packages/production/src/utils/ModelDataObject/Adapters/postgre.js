// import path from 'path'
// import postgres from '@config/database/postgres'

// import config from '@config/index'

const postgresProp = Symbol('postgres')

export default class Postgres {
  [postgresProp] = null

  constructor (postgres) {
    this[postgresProp] = postgres
  }

  static setupModel ({ modelClassObject, modelFile }) {
    // const modelSchemaFilePath = path.join(config.schemasPath, [modelFile.replace(/((Schema)?\.js)$/i, ''), 'js'].join('.'))
    // const modelName = modelFile.replace(/\.js$/i, '')

    // try {
    //   const modelSchemaObject = require(modelSchemaFilePath)
    //   const modelSchema = new postgres.Schema(modelSchemaObject.default)

    //   Object.getOwnPropertyNames(modelClassObject).forEach(key => {
    //     const match = key.match(/^(post|pre)(.+)/i)

    //     if (match) {
    //       const [
    //         modelClassObjectMethodName,
    //         modelSchemaHookAdderMethodName /* pre, post */,
    //         modelSchemaHookName
    //       ] = match

    //       modelSchema[modelSchemaHookAdderMethodName.toLowerCase()](
    //         modelSchemaHookName.toLowerCase(),
    //         modelClassObject[modelClassObjectMethodName]
    //       )
    //     }
    //   })

    //   const modelDataObject = postgres.model(modelName, modelSchema)

    //   modelClassObject.registerModuleDataObject(modelDataObject)
    // } catch (err) {
    //   throw new Error(err)
    // }
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
