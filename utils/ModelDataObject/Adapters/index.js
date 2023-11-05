import fs from 'fs'
import path from 'path'

const directoryFileList = fs.readdirSync(__dirname)

const Adapters = {
  defined (adapterName) {
    return Boolean(
      this[adapterName] &&
      typeof this[adapterName].setupModel === 'function'
    )
  }
}

directoryFileList.forEach(fileName => {
  const adapterName = fileName.replace(/\.js$/i, '')

  if (['index'].indexOf(adapterName) < 0) {
    const adapterObject = require(path.resolve(__dirname, fileName))

    Adapters[adapterName] = adapterObject.default
  }
})

export default Adapters
