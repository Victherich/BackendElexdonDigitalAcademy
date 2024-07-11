// // routes/order.js
// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');

// // Create a new order
// router.post('/order', async (req, res) => {
//   try {
//     const { userId, ...orderSummary } = req.body; // Extract userId from request body
//     const newOrder = new Order({ userId, ...orderSummary });
//     await newOrder.save();
//     res.status(201).send({ message: 'Order created successfully.', order: newOrder });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).send({ error: 'An error occurred while creating the order. Please try again.' });
//   }
// });

// // Get orders by user
// router.get('/orders/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const orders = await Order.find({ userId });
//     res.status(200).send(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).send({ error: 'An error occurred while fetching the orders. Please try again.' });
//   }
// });

// module.exports = router;




// routes/order.js
// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');
// const nodemailer = require('nodemailer');

// // Create a new order
// router.post('/order', async (req, res) => {
//   try {
//     const { userId, ...orderSummary } = req.body; // Extract userId from request body
//     const newOrder = new Order({ userId, ...orderSummary });
//     await newOrder.save();
//     res.status(201).send({ message: 'Order created successfully.', order: newOrder });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).send({ error: 'An error occurred while creating the order. Please try again.' });
//   }
// });

// // Get orders by user
// router.get('/orders/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const orders = await Order.find({ userId });
//     res.status(200).send(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).send({ error: 'An error occurred while fetching the orders. Please try again.' });
//   }
// });

// // Send order summary email
// router.post('/send-order-summary', async (req, res) => {
//   const { buyerEmail, sellerEmail, orderSummary } = req.body;

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: [buyerEmail, sellerEmail],
//     subject: 'Order Summary',
//     text: `Order Summary: ${orderSummary}`
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send({ message: 'Order summary sent successfully.' });
//   } catch (error) {
//     console.error('Error sending order summary email:', error);
//     res.status(500).send({ error: 'An error occurred while sending the order summary email. Please try again.' });
//   }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');
// const nodemailer = require('nodemailer');

// require('dotenv').config();

// // Create a new order
// router.post('/order', async (req, res) => {
//   try {
//     const { userId, ...orderSummary } = req.body; // Extract userId from request body
//     const newOrder = new Order({ userId, ...orderSummary });
//     await newOrder.save();
//     res.status(201).send({ message: 'Order created successfully.', order: newOrder });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).send({ error: 'An error occurred while creating the order. Please try again.' });
//   }
// });

// // Get orders by user
// router.get('/orders/:userId', async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const orders = await Order.find({ userId });
//     res.status(200).send(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).send({ error: 'An error occurred while fetching the orders. Please try again.' });
//   }
// });

// // Send order summary email
// router.post('/send-order-summary', async (req, res) => {
//   const { buyerEmail, sellerEmail, orderSummary } = req.body;

//   // SMTP transporter configuration
//   const transporter = nodemailer.createTransport({
//     host: 'mail.elexdontech.com', // Your SMTP server
//     port: 465, // Typically 465 for SSL or 587 for TLS
//     secure: true, // Use SSL
//     auth: {
//       user: process.env.EMAIL, // Your email address
//       pass: process.env.EMAIL_PASSWORD // Your email password
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: [buyerEmail, sellerEmail],
//     subject: 'Order Summary',
//     text: `Order Summary: ${orderSummary}`
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send({ message: 'Order summary sent successfully.' });
//   } catch (error) {
//     console.error('Error sending order summary email:', error);
//     res.status(500).send({ error: 'An error occurred while sending the order summary email. Please try again.' });
//   }
// });

// module.exports = router;

// routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure environment variables are loaded

// Create a new order
router.post('/order', async (req, res) => {
  try {
    const { userId, ...orderSummary } = req.body; // Extract userId from request body
    const newOrder = new Order({ userId, ...orderSummary });
    await newOrder.save();
    res.status(201).send({ message: 'Order created successfully.', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send({ error: 'An error occurred while creating the order. Please try again.' });
  }
});

// Get orders by user
router.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId });
    res.status(200).send(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send({ error: 'An error occurred while fetching the orders. Please try again.' });
  }
});

// Send order summary email
router.post('/send-order-summary', async (req, res) => {
  const { buyerEmail, sellerEmail, orderSummary } = req.body;

  // Ensure environment variables are loaded
  const email = process.env.EMAIL;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!email || !emailPassword) {
    console.error('Error: EMAIL and EMAIL_PASSWORD environment variables are not set.');
    return res.status(500).send({ error: 'Server configuration error. Please try again later.' });
  }

  // SMTP transporter configuration with verbose logging
  const transporter = nodemailer.createTransport({
    host: 'mail.elexdontech.com', // Your SMTP server
    port: 465, // Typically 465 for SSL or 587 for TLS
    secure: true, // Use SSL
    auth: {
      user: email, // Your email address
      pass: emailPassword // Your email password
    },
    logger: true, // Enable logging to console
    debug: true // Enable debugging output
  });

  const mailOptions = {
    from: email,
    to: [buyerEmail, sellerEmail],
    subject: 'Order Summary',
    text: `Order Summary: ${orderSummary}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    res.status(200).send({ message: 'Order summary sent successfully.' });
  } catch (error) {
    console.error('Error sending order summary email:', error);
    res.status(500).send({ error: 'An error occurred while sending the order summary email. Please try again.' });
  }
});

module.exports = router;
