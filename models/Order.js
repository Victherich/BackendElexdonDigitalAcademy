
// models/Order.js
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   date: { type: Date, required: true },
//   transactionRef: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, required: true },
//   cartItems: [{
//     title: { type: String, required: true },
//     price: { type: String, required: true },
//     id: { type: String, required: true },
//   }],
//   total: { type: String, required: true }
// });

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;


// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  transactionRef: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  referrerCode: { type: String, default: '' }, // New field for referral code
  cartItems: [{
    title: { type: String, required: true },
    price: { type: String, required: true },
    id: { type: String, required: true },
  }],
  total: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
