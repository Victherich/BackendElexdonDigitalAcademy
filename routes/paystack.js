// routes/paystack.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/verify-transaction', async (req, res) => {
  const { reference } = req.body;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (response.data.status && response.data.data.status === 'success') {
      res.json({ status: 'success', message: 'Transaction verified' });
    } else {
      res.json({ status: 'failure', message: 'Transaction verification failed' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal Server Error', error });
  }
});

module.exports = router;
