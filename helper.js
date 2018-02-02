const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('./constants')

function signToken (options = {}) {
  return new Promise((resolve, reject) => {
    const payload = options.payload || {
      _id: '123',
      username: 'Kunal V. Mandalia',
      email: 'kunal.v.mandalia@gmail.com'
    }

    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '5m' }, (error, token, a) => {
      if (error) {
        throw new Error(`Error creating JWT: ${error}`)
        reject()
      }
      resolve(token)
    })
  })
}

module.exports = {
  signToken,
}
