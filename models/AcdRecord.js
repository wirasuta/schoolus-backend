const mongoose = require('mongoose')

const acdRecordSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Report', 'Exam', 'Quiz'],
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    term: {
        type: String,
        required: true
    },
    fields: {
        type: [{
            type: String,
            required: true
        }],
        required: true
    },
    marks: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mark',
            required: true
        }],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Record', acdRecordSchema)