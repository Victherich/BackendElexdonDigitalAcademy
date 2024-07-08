
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const User = require('../models/User');
// const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET;

// // Utility function to send emails
// const sendVerificationEmail = async (email, token) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: 'Email Verification',
//     text: `Please verify your email by clicking on the following link: ${process.env.CLIENT_URL}/verify/${token}`
//   };

//   await transporter.sendMail(mailOptions);
// };

// // Sign Up
// router.post('/signup', async (req, res) => {
//   const { fullName, email, phoneNumber, password } = req.body;

//   try {
//     // Check if the email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).send({ error: 'Email already in use.' });
//     }

//     // Hash the password and create a new user
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ fullName, email, phoneNumber, password: hashedPassword });
//     const savedUser = await newUser.save();

//     // Generate a verification token and send verification email
//     const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '1h' });
//     await sendVerificationEmail(email, token);

//     res.status(201).send({ message: 'User registered. Please verify your email.' });
//   } catch (error) {
//     console.error('Error during sign-up:', error);
//     res.status(400).send({ error: 'An error occurred during sign-up. Please try again.' });
//   }
// });



// // Verify Email
// router.get('/verify/:token', async (req, res) => {
//   try {
//     const { token } = req.params;
//     const decoded = jwt.verify(token, JWT_SECRET);

//     // Find the user by ID
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(404).send({ error: 'User not found.' });
//     }

//     // Update the user's isVerified status to true
//     user.isVerified = true;
//     await user.save();

//     // Send a success response
//     res.send({ message: 'Email verified successfully.' });
//   } catch (error) {
//     console.error('Email verification error:', error);
//     res.status(400).send({ error: 'Invalid or expired token.' });
//   }
// });




// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.error('User not found:', email);
//       return res.status(404).send({ error: 'User not found.' });
//     }

//     // Compare the password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.error('Invalid credentials for user:', email);
//       return res.status(401).send({ error: 'Invalid credentials.' });
//     }

//     // Check if the user is verified
//     if (!user.isVerified) {
//       console.error('Email not verified for user:', email);
//       return res.status(403).send({ error: 'Email not verified.' });
//     }

//     // Generate the token
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10000h' });

//     // Send the response with user data and token
//     res.send({
//       token,
//       user: {
//         userId: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         phoneNumber: user.phoneNumber
//       }
//     });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).send({ error: 'Internal server error.' });
//   }
// });

// // Forgot Password

// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if the user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send({ error: 'User not found.' });
//     }

//     // Generate a token for password reset
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
//     const resetLink = `${process.env.CLIENT_URL}/resetpassword/${token}`;

//     // Set up the email transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'Password Reset',
//       text: `Click the link to reset your password: ${resetLink}`
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);
//     res.send({ message: 'Please click the password reset link sent to your email.' });
//   } catch (error) {
//     console.error('Forgot Password error:', error);
//     res.status(500).send({ error: 'An error occurred while processing your request. Please try again.' });
//   }
// });


// // Reset Password
// router.post('/reset-password/:token', async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, JWT_SECRET);

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Update the user's password
//     const user = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
//     if (!user) {
//       return res.status(404).send({ error: 'User not found.' });
//     }

//     res.send({ message: 'Password reset successfully.' });
//   } catch (error) {
//     console.error('Reset Password error:', error);
//     if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
//       return res.status(400).send({ error: 'Invalid or expired token.' });
//     }
//     res.status(500).send({ error: 'An error occurred while processing your request. Please try again.' });
//   }
// });

// // Logout
// router.post('/logout', (req, res) => {
//   res.send({ message: 'Logged out successfully.' });
// });

// module.exports = router;




const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Utility function to send emails
const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.elexdontech.com', // Replace with your actual domain
    port: 465, // Use 465 for SSL
    secure: true, // True for port 465
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
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ error: 'Email already in use.' });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, phoneNumber, password: hashedPassword });
    const savedUser = await newUser.save();

    // Generate a verification token and send verification email
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(email, token);

    res.status(201).send({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(400).send({ error: 'An error occurred during sign-up. Please try again.' });
  }
});

// Verify Email
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    // Update the user's isVerified status to true
    user.isVerified = true;
    await user.save();

    // Send a success response
    res.send({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).send({ error: 'Invalid or expired token.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      return res.status(404).send({ error: 'User not found.' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Invalid credentials for user:', email);
      return res.status(401).send({ error: 'Invalid credentials.' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      console.error('Email not verified for user:', email);
      return res.status(403).send({ error: 'Email not verified.' });
    }

    // Generate the token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '10000h' });

    // Send the response with user data and token
    res.send({
      token,
      user: {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ error: 'Internal server error.' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    // Generate a token for password reset
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `${process.env.CLIENT_URL}/resetpassword/${token}`;

    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      host: 'mail.elexdontech.com', // Replace with your actual domain
      port: 465, // Use 465 for SSL
      secure: true, // True for port 465
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

    // Send the email
    await transporter.sendMail(mailOptions);
    res.send({ message: 'Please click the password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot Password error:', error);
    res.status(500).send({ error: 'An error occurred while processing your request. Please try again.' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    const user = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    res.send({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Reset Password error:', error);
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(400).send({ error: 'Invalid or expired token.' });
    }
    res.status(500).send({ error: 'An error occurred while processing your request. Please try again.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.send({ message: 'Logged out successfully.' });
});

module.exports = router;

