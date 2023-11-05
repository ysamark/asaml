import database from '@config/database'
import { Helper } from '@utils/Helper'

import Adapters from './Adapters'

const config = {
  defaultAdapter: database.adapter
}

const adapterObjectProp = Symbol('adapterObject')

export class ModelDataObject {
  [adapterObjectProp] = null

  constructor (adapterObject, Model, type = config.defaultAdapter) {
    const Adapter = Adapters[(typeof type === typeof 'str' && type) || config.defaultAdapter]

    if (Helper.isClass(Adapter)) {
      this[adapterObjectProp] = new Adapter(adapterObject, Model)

      Object.getOwnPropertyNames(Adapter.prototype)
        .filter(prop => Boolean(
          ['constructor', '__init', 'handle'].indexOf(prop) < 0 &&
          typeof this[adapterObjectProp][prop] === 'function'
        ))
        .forEach(prop => {
          this[prop] = async (...args) => {
            const data = this[adapterObjectProp][prop].apply(this[adapterObjectProp], args)

            if (data instanceof Promise) {
              return await data
            }

            return data
          }
        })
    }
  }

  hasValidAdapter () {
    return Boolean(this[adapterObjectProp])
  }
}
