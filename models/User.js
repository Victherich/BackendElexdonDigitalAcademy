const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, minlength: 5 },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
