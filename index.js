const express = require('express')

const port = process.env.PORT || 3000
const app = express()
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    const { q = 'World' } = req.query
    res.send(`Hello ${q}!`)
})

app.listen(port, () => console.log(`Ready at port ${port}`))

module.exports = app