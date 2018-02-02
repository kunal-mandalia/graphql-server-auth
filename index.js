const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const resolver = require('./resolver')
const schema = require('./schema')()
const { isAuthenticated } = require('./middleware')
const { JWT_SECRET_KEY, PORT } = require('./constants')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/private/graphql', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.all('/private/graphql', isAuthenticated)
app.use('/private/graphql', graphqlHTTP(req => {
  return {
  schema: schema,
  rootValue: resolver,
  graphiql: true,
  context: req.context || null,
}}))

app.listen(PORT)
console.log(`Running protected GraphQL API server at <domain>:${PORT}/private/graphql`)