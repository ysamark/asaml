import path from 'path'

export const initApplicationConfig = async () => {
  const { Router, config, ApplicationModuleConfig } = await import('@asa')
  const { getAppModules, isFile, moduleRefToPath } = await import('@asa/utils')

  if (isFile(`${config.rootDir}/config/routes.js`)) {
    await import(`${config.rootDir}/config/routes.js`)
  }

  const appModules = getAppModules()

  for (const appModule in appModules) {
    const appModuleConfigDir = config.resolveModulePath(appModule, 'config')
    const appModuleConfigsFilePath = path.join(appModuleConfigDir || __filename, 'index.js')
    const appModuleRoutesFilePath = path.join(appModuleConfigDir || __filename, 'routes.js')

    const appModuleConfigs = new ApplicationModuleConfig({
      pathPrefix: moduleRefToPath(appModule),
      middlewares: []
    })

    if (isFile(appModuleConfigsFilePath)) {
      const { default: appModuleConfigsObject } = await import(appModuleConfigsFilePath)

      if (appModuleConfigsObject && typeof appModuleConfigsObject === 'object') {
        Object.assign(appModuleConfigs, appModuleConfigsObject)
      }
    }

    if (appModuleConfigDir && isFile(appModuleRoutesFilePath)) {
      const { routes } = await import(appModuleRoutesFilePath)

      if (typeof routes === 'function') {
        /**
         * draw routes for the current module
         *
         * use the module path as the route group prefix
         * and the module name/ref as the route group module ref
         *
         * doing something like
         */
        Router.group(appModuleConfigs.pathPrefix, `${appModuleConfigs.middlewares.join('+')}@${appModule}`, (routerProps) => {
          routes(routerProps)
        })
      }
    }
  }
}
