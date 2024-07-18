// routes/contact.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  console.log('Received form data:', req.body); // Log received data

  // Setup nodemailer transport
  let transporter = nodemailer.createTransport({
    host: 'mail.elexdontech.com', // e.g., 'smtp.gmail.com' for Gmail
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // your email address
      pass: process.env.EMAIL_PASSWORD, // your email password
    },
  });

  // Email options
  let mailOptions = {
    from: email,
    to: process.env.EMAIL,
    subject: `Contact Form Submission at Elexdon Digital Academy from ${name}`,
    text: message,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ status: 'success', message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error); // Log error
    res.status(500).json({ status: 'error', message: 'Failed to send message', error });
  }
});

module.exports = router;
