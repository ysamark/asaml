const { system } = require('../vendor/system')

system`
  npm run cross-env NODE_ENV=test jest
`
