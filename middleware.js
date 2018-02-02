const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('./constants')

function isAuthenticated (req, res, next) {
  const token = req.body.token || req.headers.authorization
  // check jwt signature
  // get user information from jwt
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
      if (error) { return res.status(400).json({ error }) }
      req.context = decoded
      next()
    })
  } else {
    next()
  }
}

module.exports = {
  isAuthenticated
}