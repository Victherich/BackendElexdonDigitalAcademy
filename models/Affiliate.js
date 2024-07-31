const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  bankAccount: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referralLink: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Affiliate', affiliateSchema);
