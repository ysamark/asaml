const { exec } = require('child_process')

exports.system = (props, ...values) => {
  const lines = []

  let i = 0

  for (; i < props.length; i++) {
    const line = props[i] + ((values[i] && String(values[i])) || '')

    lines.push(
      line
        .split(/\n+/)
        .filter(l => /\S/.test(l))
        .map(l => l.trim())
        .join(' && ')
    )
  }

  const command = lines.join('')

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }

    console.log('stdout => ', stdout)
  })
}
