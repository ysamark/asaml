import { getProjectDefaultLang } from '../utils'

export const defaultServerConfig = {
  entrypoint: `src/server.development.${getProjectDefaultLang()}`,

  watch: [
    'src'
  ],

  ignore: [
    /node_modules/i
  ],

  env: {
    NODE_ENV: 'development',
    DEBUG: 'app:root',
    PORT: '7000'
  },

  execMap: {
    js: 'sucrase-node',
    ts: 'sucrase-node'
  }
}
