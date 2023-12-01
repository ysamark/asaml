#!usr/bin/env node

const path = require('path')

const { distPackageFiles } = require('../dist/dist-package-files')

try {
  const packageJsonFile = require(path.resolve(process.cwd(), 'package.json'))

  if (packageJsonFile.dist instanceof Array) {
    distPackageFiles(packageJsonFile.dist)
  }
} catch (err) {
} finally {
  console.log('\nDone!!\n')
}
