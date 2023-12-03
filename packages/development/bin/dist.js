#!/usr/bin/env node

const { distPackageFiles } = require('../dist-package-files')
const { getPackageDist } = require('../get-package-dist')

distPackageFiles(getPackageDist())
