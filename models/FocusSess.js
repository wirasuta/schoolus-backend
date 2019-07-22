const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    start: {
        type: Date,
        required: true,
        default: +Date.now()
    },
    duration_sec: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Session', sessionSchema)