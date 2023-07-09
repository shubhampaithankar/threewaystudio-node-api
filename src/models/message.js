const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    enum: ['1', '2', '3'],
    required: true,
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  transporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Message', messageSchema)
