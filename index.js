const express = require('express')
const mongoose = require('mongoose')
const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const schema = require('./graphql/schema')

const { DB_USER, DB_PASSWORD, DB_NAME, PORT } = process.env
const port = PORT || 3000

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || authHeader === '') {
    req.isAuth = false
    return next()
  }
  const token = authHeader.split(' ')[1]
  if (!token || token === '') {
    req.isAuth = false
    return next()
  }

  try {
    const decToken = jwt.verify(token, process.env.APP_SECRET)
    req.isAuth = true
    req.userId = decToken.userId
    req.userName = decToken.userName
    return next()
  } catch (error) {
    console.log(error)
    req.isAuth = false
  }
  next()
})

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
)

app.get('/', (req, res) => {
  const { q = 'Gan' } = req.query
  res.send(`Hello ${q}!`)
})

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@wirasuta-cluster-rudkp.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => console.log('Connected to mongodb'))
  .then(() => app.listen(port, () => console.log(`Ready at port ${port}`)))
  .catch(err => {
    console.log(err)
  })

module.exports = app
