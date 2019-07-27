const mongoose = require('mongoose')

const voucherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  vendor: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  available: {
    type: Number,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  img_url: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Voucher', voucherSchema)
