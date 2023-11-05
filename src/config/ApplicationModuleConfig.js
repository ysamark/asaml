const propsSymbol = Symbol('props')

export class ApplicationModuleConfig {
  [propsSymbol] = {
    middlewares: []
  }

  constructor (initialProps) {
    if (typeof initialProps === 'object') {
      Object.assign(this, initialProps)
    }
  }

  get middlewares () {
    return this[propsSymbol].middlewares
  }

  set middlewares (middlewares) {
    if (middlewares instanceof Array) {
      middlewares = middlewares.filter(middleware => Boolean(
        typeof middleware === 'string' && /\S/.test(middleware)
      ))

      Object.assign(this[propsSymbol], { middlewares })
    }
  }
}
