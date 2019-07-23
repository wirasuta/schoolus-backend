const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
  }
})

module.exports = mongoose.model('User', userSchema)
