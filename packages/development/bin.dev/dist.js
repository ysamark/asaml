#!/usr/bin/env node

const { distPackageFiles } = require('../src/dist-package-files')
const { getPackageDist } = require('../src/get-package-dist')

distPackageFiles(getPackageDist())
