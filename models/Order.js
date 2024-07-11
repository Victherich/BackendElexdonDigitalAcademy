// // models/Order.js
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
//   date: { type: Date, required: true },
//   transactionRef: { type: String, required: true },
//   orderRef: { type: String, required: true, unique: true },
//   deliveryCharge: { type: Number, required: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, required: true },
//   address: { type: String, required: true },
//   state: { type: String, required: true },
//   city: { type: String, required: true },
//   cartItems: { type: [String], required: true },
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
  cartItems: [{
    title: { type: String, required: true },
    price: { type: String, required: true },
    id: { type: String, required: true },
  }],
  total: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

