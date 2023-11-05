import path from 'path'

const propsSymbol = Symbol('props')

export class ApplicationConfig {
  static [propsSymbol] = {
    module: 'app',
    modulesDirName: 'modules'
  }

  static get defaultModuleDir () {
    return this.resolvePath(this.module)
  }

  static get defaultModulesDirName () {
    return this[propsSymbol].modulesDirName
  }

  static get modulesDirName () {
    return this.modulesDirExists() ? this.defaultModulesDirName : null
  }

  static get module () {
    return this[propsSymbol].module
  }

  /**
   * @var string
   *
   * Application root dir
   */
  static get rootDir () {
    return require.main.path
  }

  /**
   * @method string
   *
   * controllers path getter
   */
  static get controllersPath () {
    return this.resolvePath(this.module, 'controllers')
  }

  /**
   * @method string
   *
   * models path getter
   */
  static get modelsPath () {
    return this.resolvePath(this.module, 'models')
  }

  /**
   * @method string
   *
   * middlewares path getter
   */
  static get middlewaresPath () {
    return this.resolvePath(this.module, 'middlewares')
  }

  /**
   * @method string
   *
   * helpers path getter
   */
  static get helpersPath () {
    return this.resolvePath(this.module, 'helpers')
  }

  /**
   * @method string
   *
   * controllers path getter
   */
  static controllersPathByModule (module) {
    return this.resolveModulePath(module, 'controllers')
  }

  /**
   * @method string
   *
   * models path getter
   */
  static modelsPathByModule (module) {
    return this.resolveModulePath(module, 'models')
  }

  /**
   * @method string
   *
   * middlewares path getter
   */
  static middlewaresPathByModule (module) {
    return this.resolveModulePath(module, 'middlewares')
  }

  /**
   * @method string
   *
   * helpers path getter
   */
  static helpersPathByModule (module) {
    return this.resolveModulePath(module, 'helpers')
  }

  /**
   * @method string
   *
   * schemas path getter
   */
  static get schemasPath () {
    return this.resolvePath('database', 'schemas')
  }

  static modulesDirExists () {
    const { isDir } = require('@asa/utils')

    return isDir([this.rootDir, this.defaultModulesDirName])
  }

  static resolveModulePath (module, ...args) {
    const modulePathSliceMap = (modulePathSlice) => (
      /**
       * Prefix whole the module path slice with: modules/
       */
      [this.modulesDirName, modulePathSlice].join(path.sep)
    )

    module = module.split(/\s*:+\s*/).map(modulePathSliceMap).join(path.sep)

    return this.resolvePath(module, ...args)
  }

  // /**
  //  * @method Boolean
  //  *
  //  * verify if a given string matches to a module controller path
  //  *
  //  * @param string controllerPath the controller path
  //  */
  // static resolveControllerAndModuleRefs (controllerPath) {
  //   if (typeof 'str' !== typeof controllerPath) {
  //     return false
  //   }

  //   const { capitalize, isFile } = require('@asa/utils')

  //   /**
  //    * path: pages => {
  //    *  module => 'pages'
  //    *  controller => null
  //    * }
  //    *
  //    * path: pages:sales:clients => {
  //    *  module => 'pages:sales'
  //    *  controller => 'clients'
  //    * }
  //    */

  //   const controllerPathSlices = controllerPath.split(/\s*:+\s*/)
  //   const controllerPathSlicesHeadLimit = controllerPathSlices.length >= 2 ? -1 : 1
  //   const controllerPathHead = controllerPathSlices.slice(0, controllerPathSlicesHeadLimit)
  //   const controllerPathLastSlice = controllerPathSlices[-1 + controllerPathSlices.length]

  //   const moduleRootPath = this.resolveModulePath(controllerPathSlices.join(':'))
  //   const moduleControllersPath = this.controllersPathByModule(controllerPathHead.join(':'))

  //   const refs = {
  //     module: this.module,
  //     controller: controllerPathSlices[0] || null,
  //     path: null
  //   }

  //   switch (controllerPathSlices.length >= 1) {
  //     case true:

  //       // console.log('\n\n\ncontrollerPathHead => ', controllerPathHead, '\n\n\n')

  //       if (moduleControllersPath) {
  //         const controllerFileName = `${capitalize(controllerPathLastSlice)}Controller.js`

  //         const controllerFilePath = path.resolve(moduleControllersPath, controllerFileName)

  //         if (isFile(controllerFilePath)) {
  //           Object.assign(refs, {
  //             controller: controllerPathLastSlice,
  //             module: controllerPathHead.join(':'),
  //             path: controllerPathSlices.join(':')
  //           })

  //           return refs
  //         }

  //         if (moduleRootPath) {
  //           Object.assign(refs, {
  //             module: controllerPathSlices.join(':'),
  //             path: controllerPathSlices.join(':')
  //           })
  //         }
  //       }
  //       break

  //     case false:
  //       Object.assign(refs, {
  //         controller: controllerPathSlices[0] || null,
  //         path: null
  //       })
  //       break
  //   }

  //   // if (moduleControllersPath) {
  //   //   console.log(`\n\n\n\nGet controller(${moduleRootPath}) => ${controllerPathLastSlice}\n\n\n`)

  //   //   // if () {
  //   //   // }

  //   //   Object.assign(refs, {
  //   //     module: 'A module'
  //   //   })
  //   // }

  //   return refs
  // }

  /**
   * @method string
   *
   * resolve a given path string
   */
  static resolvePath () {
    const args = (
      Array.from(arguments)
        .filter(arg => typeof arg === typeof 'str' && /\S/.test(arg))
    )

    const { isDir } = require('@asa/utils')

    const pathAlternates = [
      [this.rootDir, ...args],
      [this.rootDir, this.defaultModulesDirName, ...args]
    ]

    for (const pathAlternate of pathAlternates) {
      if (isDir(pathAlternate)) {
        return pathAlternate.join(path.sep)
      }
    }

    return null
  }

  static setup (configProps) {
    if (typeof configProps === 'object') {
      this[propsSymbol] = {
        ...this[propsSymbol],
        ...configProps
      }
    }

    return this
  }
}
