const fs = require('fs')
const path = require('path')

const nodemon = require('nodemon/lib/nodemon')

const [scriptFileRelativePath, ...args] = Array.from(process.argv).slice(2)

const scriptFileAbsolutePath = path.resolve(process.cwd(), scriptFileRelativePath)

// console.log('\n\n\nscriptFileAbsolutePath => ', scriptFileAbsolutePath, '\n\n\n\n')

const nodemonArgs = {
  scriptPosition: 0,
  script: scriptFileAbsolutePath,

  verbose: true,

  args
}

nodemon.on('restart', (...props) => {
  console.log('Nodemon restarted: ', props)
})

// console.log('\n\n\n\nnodemonArgs => ', nodemonArgs, '\n\n\n\n\n')

if (fs.existsSync(scriptFileAbsolutePath)) {
  nodemon(nodemonArgs)
}
