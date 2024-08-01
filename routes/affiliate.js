const express = require('express');
const router = express.Router();
const Affiliate = require('../models/Affiliate');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate a 10-digit referral code
const generateReferralCode = () => {
  return crypto.randomBytes(5).toString('hex').toUpperCase();
};


// Nodemailer transporter setup
let transporter = nodemailer.createTransport({
  host: 'mail.elexdontech.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, bankAccount } = req.body;

    // Check if the affiliate already exists
    const existingAffiliate = await Affiliate.findOne({ email });
    if (existingAffiliate) {
      return res.status(400).json({ error: 'Affiliate with this email already exists.' });
    }

    // Generate referral code and link
    const referralCode = generateReferralCode();
    const referralLink = `https://www.elexdondigitalacademy.com/ref/${referralCode}`;

    // Create new affiliate
    const newAffiliate = new Affiliate({ firstName, lastName, email, phone, bankAccount, referralCode, referralLink });
    await newAffiliate.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Welcome to Elexdon Digital Academy Affiliate Program',
      text: `Hello ${firstName},\n\nThank you for joining our affiliate program! Here are your details:\n\nReferral Code: ${referralCode}\nReferral Link: ${referralLink}\n\nStart sharing and earn rewards!\n\nBest regards,\nElexdon Digital Academy Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email.' });
      }
      console.log('Email sent: ' + info.response);
    });

    res.status(201).json({ message: 'Affiliate registered successfully.', referralCode, referralLink });
  } catch (error) {
    console.error('Error registering affiliate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
