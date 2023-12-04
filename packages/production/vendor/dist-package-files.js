const { distPackageFiles } = require('asaml-dev/dist-package-files')
const { getPackageDist } = require('asaml-dev/get-package-dist')

distPackageFiles(getPackageDist())
