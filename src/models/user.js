const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['manufacturer', 'transporter'],
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('User', userSchema)
