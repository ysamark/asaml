import { config } from '@asa'

export function resolveControllerAndModuleRefs (routeSourcePath) {
  const controllerAndModuleRefs = {
    module: config.module,
    controller: String(routeSourcePath).trim()
  }

  if (typeof 'str' !== typeof routeSourcePath &&
    /\S/.test(routeSourcePath)) {
    return controllerAndModuleRefs
  }

  const routeSourcePathSlices = routeSourcePath.split(/\s*:\s*/)

  if (routeSourcePathSlices.length >= 2) {
    const routeSourcePathSlicesHead = routeSourcePathSlices
      .slice(0, -1)
      .join(':')
    const routeSourcePathSlicesTail = routeSourcePathSlices[
      -1 + routeSourcePathSlices.length
    ]

    Object.assign(controllerAndModuleRefs, {
      controller: routeSourcePathSlicesTail,
      module: routeSourcePathSlicesHead
    })
  }

  return controllerAndModuleRefs
}
