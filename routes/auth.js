const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Utility function to send emails
const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: ${process.env.CLIENT_URL}/verify/${token}`
  };

  await transporter.sendMail(mailOptions);
};

// Sign Up
router.post('/signup', async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, phoneNumber, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(email, token);

    res.status(201).send({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Verify Email

//   router.get('/verify/:token', async (req, res) => {
//   try {
//     const { token } = req.params;
//     const decoded = jwt.verify(token, JWT_SECRET);

//     await User.findByIdAndUpdate(decoded.id, { isVerified: true });
//     res.redirect(`${process.env.CLIENT_URL}/userlogin`);
//   } catch (error) {
//     res.status(400).send({ error: 'Invalid or expired token.' });
//   }
// });


// Verify Email
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);

    // Update the user's isVerified status to true
    await User.findByIdAndUpdate(decoded.id, { isVerified: true });

    // Redirect the user to the userlogin page of your frontend
    res.redirect(`${process.env.CLIENT_URL}/userlogin`);
  } catch (error) {
    res.status(400).send({ error: 'Invalid or expired token.' });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found.');

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials.');

    // Check if the user is verified
    if (!user.isVerified) throw new Error('Email not verified.');

    // Generate the token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10000h' });

    // Log the user data for debugging
    console.log('User data:', {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber
    });

    // Send the response with user data and token
    res.send({
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found.');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);
    res.send({ message: 'Password reset link sent to email.' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.send({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(400).send({ error: 'Invalid or expired token.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.send({ message: 'Logged out successfully.' });
});

module.exports = router;
