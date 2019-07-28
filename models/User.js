const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  phone: String,
  email: String,
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  own_voucher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher',
      required: true
    }
  ]
})

module.exports = mongoose.model('User', userSchema)
