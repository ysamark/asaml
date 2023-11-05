import { RouteSource, config } from '@asa'

import { readSourceProps } from './readSourceProps'
import { resolveMiddleware } from './resolveMiddleware'
import { resolveController } from './resolveController'
import { splitSourceMiddlewaresPathList } from './splitSourceMiddlewaresPathList'
import { resolveControllerAndModuleRefs } from './resolveControllerAndModuleRefs'

// const middlewarePathListSymbol = Symbol('middlewarePathList')
// const middlewareSymbol = Symbol('middleware')
// const controllerSymbol = Symbol('controller')
const propsSymbol = Symbol('props')
const controllerAndModuleRefsSymbol = Symbol('controllerAndModuleRefs')

export class RouteSourceContext {
  [propsSymbol] = {
    path: null,
    controllerName: null,
    middlewaresPathList: [],
    middlewares: null
  }

  // [middlewarePathListSymbol] = [];
  // [middlewareSymbol] = null;
  // [controllerSymbol] = null
  // action = null
  // module = null
  // controllerName = null

  constructor ({ source }) {
    /**
     * assuming that source argument is a string,
     * read it for assigning its data to the object
     * context
     */
    if (typeof source === typeof 'str') {
      source = readSourceProps({ source })
    }

    if (typeof source === 'object') {
      if (source instanceof RouteSource) {
        source = source.props
      }

      Object.assign(this, source)
    }
  }

  get props () {
    return Object(this[propsSymbol])
  }

  set middlewares (middlewares) {}

  get controllerAndModuleRefs () {
    if (this[controllerAndModuleRefsSymbol]) {
      return this[controllerAndModuleRefsSymbol]
    }

    this[controllerAndModuleRefsSymbol] = resolveControllerAndModuleRefs(this.path)

    return this[controllerAndModuleRefsSymbol]
  }

  get controller () {
    const { controller } = this.controllerAndModuleRefs

    return this.resolveController(controller, this.module)
  }

  get module () {
    const { module } = this.controllerAndModuleRefs

    return module
  }

  get middlewares () {
    if (this[propsSymbol].middlewares) {
      return this[propsSymbol].middlewares
    }

    const sourcePath = this.path
    const sourcePathSlices = sourcePath.split(/\s*:\s*/)
    const sourcePathLastSlice = sourcePathSlices[-1 + sourcePathSlices.length]
    const sourcePathSlicesHead = sourcePathSlices.length >= 2
      ? sourcePathSlices.slice(0, -1).join(':')
      : undefined

    const middlewareHandlers = []

    if (this.middlewaresPathList) {
      this[propsSymbol].middlewaresPathList = splitSourceMiddlewaresPathList({
        middlewaresPathList: this.middlewaresPathList
      })
    }

    for (const middlewarePath of this.middlewaresPathList) {
      /**
       * For getting the right path for the current middleware object,
       * it should considerate
       */

      if (sourcePathLastSlice === middlewarePath.path ||
        (middlewarePath.path === this.path && sourcePathSlices.length >= 2) ||
        !middlewarePath.path) {
        middlewarePath.path = sourcePathSlicesHead || config.module
      }

      const middlewareHandlerList = this.resolveMiddleware(middlewarePath.data, middlewarePath.path)

      for (const middlewareHandler of middlewareHandlerList) {
        middlewareHandlers.push(middlewareHandler)
      }
    }

    this[propsSymbol].middlewares = middlewareHandlers

    return middlewareHandlers
  }

  get path () {
    return this[propsSymbol].path
  }

  set path (path) {
    this[propsSymbol].path = path
  }

  get middlewaresPathList () {
    return this[propsSymbol].middlewaresPathList
  }

  set middlewaresPathList (middlewaresPathList) {
    middlewaresPathList = middlewaresPathList.filter(middlewaresPath => Boolean(
      this[propsSymbol].middlewaresPathList.indexOf(middlewaresPath) < 0
    ))

    if (middlewaresPathList instanceof Array) {
      this[propsSymbol].middlewaresPathList = [
        ...this[propsSymbol].middlewaresPathList,
        ...middlewaresPathList
      ]
    }
  }

  resolveController = (controllerName, controllerModule = null) => {
    return resolveController({ controllerName, controllerModule, sourceContext: this })
  }

  resolveMiddleware = (middlewaresStr, middlewareModule = null) => {
    return resolveMiddleware({ middlewaresStr, middlewareModule, sourceContext: this })
  }
}
