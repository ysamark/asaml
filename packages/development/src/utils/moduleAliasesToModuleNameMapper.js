export const moduleAliasesToModuleNameMapper = (moduleAliases, options) => {
  const moduleNameMap = {}

  const pathPrefix = typeof options.prefix === typeof 'str' ? options.prefix.replace(/(\/)+$/, '') : ''

  if (typeof moduleAliases === 'object') {
    Object.keys(moduleAliases).forEach(moduleAlias => {
      const moduleAliasKeyRe = `^${moduleAlias}/(.*)$`
      const moduleAliasValue = `${pathPrefix}/${moduleAliases[moduleAlias].replace(/^(\.\/)+/, '')}/$1`

      moduleNameMap[moduleAliasKeyRe] = moduleAliasValue
    })
  }

  return moduleNameMap
}
