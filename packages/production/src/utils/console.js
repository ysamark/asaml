export const array = ([args]) => {
  return args.trim().split(/\n+/).map(i => i.trim()) // Array.from(args).map(i => i.trim())
}

export const moduleAliasesToModuleNameMapper = (moduleAliases, options) => {
  const moduleNameMap = {}

  const pathPrefix = typeof options.prefix === typeof 'str' ? options.prefix.replace(/(\/)+$/, '') : ''

  if (typeof moduleAliases === 'object') {
    Object.keys(moduleAliases).forEach(moduleAlias => {
      console.log(moduleAlias, moduleAliases[moduleAlias])

      const moduleAliasKeyRe = `^${moduleAlias}/(.*)$`
      const moduleAliasValue = `${pathPrefix}/${moduleAliases[moduleAlias].replace(/^(\.\/)+/, '')}/$1`

      moduleNameMap[moduleAliasKeyRe] = moduleAliasValue
    })
  }

  return moduleNameMap
}

export const pathsToModuleAliases = (paths, options) => {
  const moduleAliases = {}
  const pathPrefix = typeof options.prefix === typeof 'str' ? options.prefix.replace(/(\/)+$/, '') : ''
  const acceptMultiple = typeof options.multiple !== typeof true ? true : options.multiple

  Object.keys(paths).forEach(aliasPath => {
    const aliasPathKey = aliasPath.replace(/(\/)?\*$/, '')

    if (paths[aliasPath] instanceof Array && (paths[aliasPath].length === 1 || !acceptMultiple)) {
      const aliasPathValue = paths[aliasPath][0]?.replace(/(\/)?\*$/, '')

      const aliasPathSource = [pathPrefix, aliasPathValue || ''].join('/')

      moduleAliases[aliasPathKey] = aliasPathSource

      return
    }

    const aliasPathValues = typeof paths[aliasPath] === 'string' ? [paths[aliasPath]] : paths[aliasPath]

    const aliasPathSourceHandler = function ({ rootDir }) {
      this.rootDir = rootDir

      function aliasPathSourceHandler (_fromPath, request) {
        const path = require('path')
        const fs = require('fs')

        const { prefix, source } = this.path

        const slashRe = /[/\\\\]+/

        const requestSliceOffset = this.path.key.split(slashRe).length

        const fileNameSuffixes = array`
          .json
          /index.json
          .js
          /index.js
        `

        fileNameSuffixes.push('')

        for (let i = 0; i < source.length; i++) {
          const sourcePath = [
            this.rootDir,
            prefix,
            source[i].replace(/\/\*$/, '')
          ].join('/')

          const requestFilePathSlices = request.split(slashRe)

          const requestFilePath = requestFilePathSlices
            .slice(requestSliceOffset, requestFilePathSlices.length)
            .join('/')

          for (let n = fileNameSuffixes.length - 1; n >= 0; n--) {
            const requestFilePathAlternate = path.resolve(
              sourcePath, [requestFilePath, fileNameSuffixes[n]].join('')
            )

            if (fs.existsSync(requestFilePathAlternate)) {
              return sourcePath
            }
          }
        }

        return request
      }

      return aliasPathSourceHandler.bind(this)
    }

    if (aliasPathValues instanceof Array) {
      aliasPathSourceHandler.path = {
        prefix: pathPrefix,
        source: aliasPathValues,
        key: aliasPathKey
      }

      moduleAliases[aliasPathKey] = aliasPathSourceHandler.bind(aliasPathSourceHandler)
    }
  })

  return moduleAliases
}

export const pathsToModuleNameMapper = (paths, options) => {
  // moduleAliasesToModuleNameMapper, pathsToModuleAliases
  // paths = export const pathsToModuleAliases(paths, { prefix: '.' })
  const moduleAliases = {}
  const pathPrefix = typeof options.prefix === typeof 'str' ? options.prefix.replace(/(\/)+$/, '') : ''
  const acceptMultiple = typeof options.multiple !== typeof true ? true : options.multiple

  const parsePath = (pathPrefix, path) => {
    const pathValue = path?.replace(/\/\*$/, '')

    const absolutePathValue = [pathPrefix, pathValue || ''].join('/')

    return `${absolutePathValue}/$1`
  }

  Object.keys(paths).forEach(aliasPath => {
    const aliasPathKey = `^${aliasPath.replace(/\/\*$/, '')}/(.*)$`

    if (paths[aliasPath] instanceof Array && (paths[aliasPath].length === 1 || !acceptMultiple)) {
      // const aliasPathValue =

      const aliasPathSource = parsePath(pathPrefix, paths[aliasPath][0]) // [pathPrefix, aliasPathValue || ''].join('/')

      moduleAliases[aliasPathKey] = aliasPathSource

      return
    }

    const aliasPathValues = typeof paths[aliasPath] === 'string' ? [paths[aliasPath]] : paths[aliasPath]

    if (aliasPathValues instanceof Array) {
      moduleAliases[aliasPathKey] = aliasPathValues.map(value => parsePath(pathPrefix, value))
    }
  })

  return moduleAliases
}
