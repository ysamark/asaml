import { compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'

// import { log } from '~/config/log'
import { Helper, isClass } from '@asa/utils'

export class Authentication {
  static UserModel = null

  static async attempt ({ username, password }) {
    const authFieldKeyName = Helper.isEmail(username) ? 'email' : 'username'

    const userData = {}

    userData[authFieldKeyName] = username

    try {
      const queryResult = await this.User.where(userData)

      if (queryResult.length >= 1) {
        const user = queryResult instanceof Array ? queryResult[0] : queryResult

        const passwordMatches = await compare(password, user.password)

        if (passwordMatches) {
          const token = sign({ user: user.id }, process.env.APP_JWT_SECRET)

          return { user, token }
        } else {
          return this._error({
            status: 401,
            error_code: 1,
            message: 'Incorrect user password'
          })
        }
      } else {
        return this._error({
          status: 404,
          error_code: 0,
          message: 'Unknown user'
        })
      }
    } catch (err) {
      // log(err)

      return this._error(err)
    }
  }

  static async authenticate (request) {
    const authorization = {}

    Object.keys(request.headers).forEach(header => {
      if (/^(authorization)$/i.test(header)) {
        const re = /^(Bearer\s+)/i
        authorization.token = String(
          request.headers[header]
            .replace(re, '')
            .trim()
        )
      }
    })

    if (authorization.token) {
      try {
        const authData = verify(authorization.token, process.env.APP_JWT_SECRET)
        const validAuthData = this.validateAuthData(authData)

        if (validAuthData) {
          return authData
        }
      } catch (err) {
      }
    }

    return false
  }

  static async validateAuthData (authData) {
    if (!authData.id) {
      return false
    }

    const user = await this.User.findById(authData.id)

    return Boolean(user)
  }

  static _error (error) {
    return (
      {
        user: null,
        token: '',
        error
      }
    )
  }

  static get User () {
    if (isClass(this.UserModel)) {
      return this.UserModel
    }

    throw new TypeError('asa:Authentication: UserModel must be a valid class object')
  }
}
