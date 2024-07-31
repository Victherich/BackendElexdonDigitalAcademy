const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, subjectExpertise, education, experience } = req.body;

  console.log('Received registration data:', req.body); // Log received data

  // Setup Nodemailer transport
  let transporter = nodemailer.createTransport({
    host: 'mail.elexdontech.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // your email address from .env file
      pass: process.env.EMAIL_PASSWORD, // your email password from .env file
    },
  });

  // Email options
  let mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `New Instructor Registration from ${firstName} ${lastName}`,
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nSubject Expertise: ${subjectExpertise}\nEducation and Qualifications: ${education}\nRelevant Experience: ${experience}`,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ status: 'success', message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit application', error });
  }
});

module.exports = router;
