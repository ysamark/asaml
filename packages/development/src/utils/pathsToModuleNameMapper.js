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
