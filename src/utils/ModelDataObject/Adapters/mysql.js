import { prisma } from '@config/prisma.mysql'

const mysqlProp = Symbol('mysql')
const modelProp = Symbol('model')

export default class MySQL {
  [mysqlProp] = null

  constructor (dataObject, Model) {
    this[mysqlProp] = dataObject
    this[modelProp] = Model
  }

  static setupModel ({ modelClassObject, modelFile }) {
    // const modelSchemaFilePath = path.join(config.schemasPath, [modelFile.replace(/((Schema)?\.js)$/i, ''), 'js'].join('.'))
    const modelName = modelFile.replace(/\.js$/i, '')

    const ucFirstModelName = [
      modelName.charAt(0).toLowerCase(),
      modelName.slice(1, modelName.length)
    ].join('')

    const modelDataObject = prisma[ucFirstModelName]

    modelClassObject.registerModuleDataObject(modelDataObject)
  }

  async handle (hookName, data) {
    if (typeof this[modelProp][hookName] === 'function') {
      const result = this[modelProp][hookName].apply(data, [])

      if (result instanceof Promise) {
        await result
      }

      return result
    }
  }

  // CRUD

  // CREATE
  async create (data) {
    await this.handle('beforeCreate', data)

    const record = this[mysqlProp].create({
      data
    })

    await this.handle('afterCreate', data)

    return record
  }

  async createMany (dataList) {
    if (!(dataList instanceof Array)) {
      return
    }

    const records = []

    const recordPromiseList = dataList
      .filter(data => Boolean(data))
      .map(async data => {
        const record = await this.create(data)

        records.push(record)
      })

    await Promise.all(recordPromiseList)

    return records
  }

  // READ
  async all () {
    return await this.findAll()
  }

  async findAll () {
    const records = await this[mysqlProp].findMany()

    if (records) {
      return records
    }
  }

  async find (id) {
    if (!isNaN(id)) {
      const record = await this[mysqlProp].findUnique({
        where: {
          id: parseFloat(id)
        }
      })

      return record
    }
  }

  async read (queryProps) {
    return await this[mysqlProp].findMany(queryProps)
  }

  async readProp (prop, queryProps) {
    const select = {}

    select[prop] = true

    queryProps = queryProps || {}

    const records = await this.read({
      ...queryProps,
      select
    })

    return records
  }

  async where (where) {
    const records = await this.read({
      where
    })

    return records
  }

  async last () {
    const records = await this.read({
      take: -1
    })

    if (records instanceof Array) {
      return records[0]
    }
  }

  async first () {
    const records = await this.read({
      take: 1
    })

    if (records instanceof Array) {
      return records[0]
    }
  }

  // UPDATE
  async update (queryProps) {
    const record = await this[mysqlProp].updateMany(queryProps)

    return record
  }

  async updateById (id, data) {
    if (!isNaN(id)) {
      const record = await this.update({
        where: {
          id: parseFloat(id)
        },

        data
      })

      return record
    }
  }

  async updateBy (prop, value, data) {
    if (typeof prop === typeof 'str') {
      const where = {}

      where[prop] = value

      return await this.update({
        where,
        data
      })
    }
  }

  // DELETE
  async delete (queryProps) {
    return await this[mysqlProp].deleteMany(queryProps)
  }

  async deleteById (id) {
    if (!isNaN(id)) {
      return await this.delete({
        where: {
          id: parseFloat(id)
        }
      })
    }
  }

  async deleteBy (prop, value) {
    if (typeof prop === typeof 'str') {
      const where = {}

      where[prop] = value

      return await this.delete({
        where
      })
    }
  }
}
