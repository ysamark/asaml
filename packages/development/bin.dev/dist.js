#!/usr/bin/env node

const { distPackageFiles } = require('../dist/dist-package-files')
const { getPackageDist } = require('../dist/get-package-dist')

distPackageFiles(getPackageDist())
