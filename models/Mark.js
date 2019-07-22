const mongoose = require('mongoose')

const markSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: [{
            type: mongoose.Schema.Types.Decimal128,
            required: true
        }],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record',
        required: true
    }
})

module.exports = mongoose.model('Mark', markSchema)