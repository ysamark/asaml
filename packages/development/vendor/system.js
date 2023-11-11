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

  exec(command, (execError, stdout, stderr) => {
    const { error, log } = console

    if (execError) {
      error(`error: ${execError.message}`)
      return
    }

    if (stderr) {
      error(`stderr: ${stderr}`)
      return
    }

    log(stdout)
  })
}
