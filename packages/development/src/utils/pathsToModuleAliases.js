import { array } from './array'

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
