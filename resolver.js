const { fakeDB: db, getUserById, getUserByUsernamePassword} = require('./fakeDB')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('./constants')

function signToken (payload, jwt = jwt) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '5m' }, (error, token, a) => {
      if (error) {
        throw new Error(`Error creating JWT: ${error}`)
        reject()
      }
      resolve(token)
    })
  }).then(token => token)
}

const resolver = {
  login: ({input: { username, password }}, user, ctx) => {
    const u = getUserByUsernamePassword(username, password)
    if (u.length === 1) {
      const payload = u.pop()
      return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '5m' }, (error, token, a) => {
          if (error) {
            throw new Error(`Error creating JWT: ${error}`)
            reject()
          }
          resolve(token)
        })
      }).then(token => token)
    } else {
      throw new Error(`Incorrect username / password`)
    }
  },
  getMyProfile: (_, user, ctx) => {
    if (user && user._id) {
      return getUserById(user._id)
    } else {
      throw new Error(`Login first`)
    }
  },
  updateUsername: ({input}, user, ctx) => {
    if (user && user._id) {

      // update db
      db[user._id].username = input

      // issue new jwt
      return new Promise((resolve, reject) => {
        const payload = db[user._id]
        jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '5m' }, (error, token, a) => {
          if (error) {
            throw new Error(`Error creating JWT: ${error}`)
            reject()
          }
          resolve(token)
        })
      })
      .then(token => {
        return Object.assign({}, db[user._id], { token })
      })
      .catch(e => console.log)
    } else {
      throw new Error(`Login first`)
    }
  }
}

module.exports = resolver
