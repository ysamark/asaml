export function defineEnvVar (envVar, envVarValue = null) {
  if (!(typeof envVar === typeof 'str' && /\S/.test(envVar))) {
    throw new TypeError('environment variable name must be a valid and not-empty string')
  }

  process.env[envVar] = envVarValue
}

export function defineEnvVars (envVars) {
  if (typeof envVars !== 'object') {
    throw new TypeError('first argument must to be a valid object')
  }

  for (const envVar in envVars) {
    defineEnvVar(envVar, envVars[envVar])
  }
}
