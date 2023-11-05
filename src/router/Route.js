const propsSymbol = Symbol('props')

export class Route {
  [propsSymbol] = {
    verb: null,
    path: null,
    source: null
  }

  constructor ({ verb, path, source }) {
    Object.assign(this, {
      verb,
      path,
      source
    })
  }

  get verb () {
    return this[propsSymbol].verb?.toLowerCase()
  }

  get path () {
    return this[propsSymbol].path
  }

  get source () {
    return this[propsSymbol].source
  }

  set verb (verb) {
    Object.assign(this[propsSymbol], { verb })
  }

  set path (path) {
    Object.assign(this[propsSymbol], { path })
  }

  set source (source) {
    Object.assign(this[propsSymbol], { source })
  }
}
