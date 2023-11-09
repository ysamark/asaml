import fs from 'fs'
import path from 'path'

import { config } from '@asa'
import { capitalize, isClass } from '@asa/utils'
import { notResolvedController } from '@asa/errors'

export function resolveController ({ controllerName, controllerModule = null, sourceContext }) {
  const controllerClassName = `${capitalize(controllerName)}Controller`

  if (!(typeof controllerModule === typeof 'str')) {
    controllerModule = config.module
  }

  try {
    const controllerPath = path.resolve(
      config.controllersPathByModule(controllerModule),
        `${controllerClassName}.js`
    )

    if (fs.existsSync(controllerPath)) {
      const controllerModuleObject = require(controllerPath)

      const ControllerDataObject = controllerModuleObject[controllerClassName]

      if (isClass(ControllerDataObject)) {
        sourceContext.controllerName = controllerName

        return new ControllerDataObject()
      }
    }
  } catch (err) {
    // console.log('\n\nResolve Controller::Error => ', err, '\n\n\n')
  }

  return notResolvedController({
    controller: controllerName,
    module: controllerModule
  })
}
