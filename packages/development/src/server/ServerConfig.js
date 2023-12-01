const propsSymbol = Symbol('props')

export class ServerConfig {
  [propsSymbol] = {
    execMap: {},
    env: {}
  }

  constructor (defaultConfig) {
    if (typeof defaultConfig !== 'object') {
      throw new TypeError('defaultConfig must to be a valid object')
    }

    this.setProps(defaultConfig)
  }

  setIgnore (ignoreList) {
    const currentIgnoreList = this[propsSymbol].ignore || []

    if (ignoreList instanceof Array) {
      ignoreList
        .filter(item => currentIgnoreList.indexOf(item) < 0)
        .forEach(item => {
          currentIgnoreList.push(item)
        })
    }

    this[propsSymbol].ignore = currentIgnoreList
  }

  setWatch (watchList) {
    const currentWatchList = this[propsSymbol].watch || []

    if (watchList instanceof Array) {
      watchList
        .filter(item => currentWatchList.indexOf(item) < 0)
        .forEach(item => {
          currentWatchList.push(item)
        })
    }

    this[propsSymbol].watch = currentWatchList
  }

  setProps (props) {
    if (typeof props !== 'object') {
      throw new TypeError('props must to be a valid object')
    }

    for (const prop in props) {
      const propSetterName = `set${prop[0].toUpperCase() + prop.slice(1)}`

      if (typeof this[propSetterName] === 'function') {
        this[propSetterName](props[prop])

        continue
      }

      this[propsSymbol][prop] = props[prop]
    }
  }

  setEnv (envVars) {
    this[propsSymbol].env = {
      ...this[propsSymbol].env,
      ...envVars
    }
  }

  setExecMap (execMap) {
    this[propsSymbol].execMap = {
      ...this[propsSymbol].execMap,
      ...execMap
    }
  }

  get props () {
    return this[propsSymbol]
  }
}
