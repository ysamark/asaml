import path from 'path'

import { isDir } from '@asaml/fs-helpers/src/isDir'
import { copyFileTo, getDirectoryFilesList } from '@asaml/fs-helpers'
import { readHelperOptions } from '@asaml/fs-helpers/src/readHelperOptions'
import { getFileRelativePath } from '@asaml/fs-helpers/src/getFileRelativePath'

export function distPackageFiles (filesList, distOptions) {
  if (!(filesList instanceof Array)) {
    throw new TypeError('files list must be an array')
  }

  const noStringItemInFilesList = filesList
    .find(item => (
      typeof 'str' !== typeof item || !/\S/.test(item)
    ))

  if (noStringItemInFilesList) {
    throw new TypeError('all items in files list must be non empty strings')
  }

  distOptions = typeof distOptions !== 'object' ? {} : distOptions

  const options = readHelperOptions(distOptions, {
    rootDir: process.cwd()
  })

  const allFilesList = []

  filesList.forEach(fileRelativePath => {
    const fileAbsolutePath = path.join(options.rootDir, fileRelativePath)

    if (!isDir(fileAbsolutePath)) {
      return allFilesList.push(fileAbsolutePath)
    }

    getDirectoryFilesList(fileAbsolutePath)
      .forEach(filePath => {
        allFilesList.push(filePath)
      })
  })

  for (const fileAbsolutePath of allFilesList) {
    const fileRelativePath = getFileRelativePath(options.rootDir, fileAbsolutePath)
    const fileDistPath = path.join(options.rootDir, 'dist', fileRelativePath)

    copyFileTo({
      filePath: fileAbsolutePath,
      dest: fileDistPath
    })
  }
}
