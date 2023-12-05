export const defaultServerConfig = {
  entrypoint: 'src/server.development.js',

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
