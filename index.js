const express = require('express')

const port = process.env.PORT || 3000
const app = express()
app.use(express.urlencoded({ extended: true }))

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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


app.listen(port, () => console.log(`Ready at port ${port}`))

module.exports = app