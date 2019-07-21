const express = require('express')

const port = process.env.PORT || 3000
const app = express()
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    console.log(req.body)
    console.log(req.query)
    res.send('Hello world')
})

app.listen(port, () => console.log(`Ready at port ${port}`))

module.exports = app