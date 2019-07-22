const express = require('express')
const mongoose = require('mongoose')

const User = require('./models/User')
const Record = require('./models/AcdRecord')
const Session = require('./models/FocusSess')
const Mark = require('./models/Mark')
const { DB_USER, DB_PASSWORD, DB_NAME, PORT } = process.env
const port = PORT || 3000

const app = express()
app.use(express.urlencoded({ extended: true }))

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/submit', (req,res) => {
    const newUser = new User({
        name: 'jdoe',
        full_name: 'John Doe',
        school: 'SMA Bulan 01',
        grade: 12,
        email: 'jdoe@mail.com',
        password: 'test_password'
    })
    newUser
        .save()
        .then((e) => res.json(e))
})

app.get('/wait/:time', async (req, res) => {
    const { time = 0 } = req.params
    const recTime = +new Date
    await sleep(parseInt(time))
    const afSleepTime = +new Date
    const resText = `Request received at ${recTime}<br />Request received at ${afSleepTime}<br />Slept for ${time} ms`
    res.send(resText)
})

app.get('/', (req, res) => {
    const { q = 'World' } = req.query
    res.send(`Hello ${q}!`)
})

mongoose
    .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@wirasuta-cluster-rudkp.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then(() => console.log('Connected to mongodb'))
    .then(() => app.listen(port, () => console.log(`Ready at port ${port}`)))
    .catch((err) => {
        console.log(err)
    })

module.exports = app