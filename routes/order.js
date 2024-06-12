// routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

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

module.exports = router;
