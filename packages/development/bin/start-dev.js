const { system } = require('../vendor/system')

system`
  npm run cross-env NODE_ENV=production DEBUG=app:root PORT=7000 node -r dotenv/config dist/server.js
`
