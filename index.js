const express = require('express')
const mongoose = require('mongoose')
const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser-graphql')

const schema = require('./graphql/schema')

const { DB_USER, DB_PASSWORD, DB_NAME, PORT } = process.env
const port = PORT || 3000

const app = express()

app.use(bodyParser.graphql())

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
