



const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

// Connect to the database
mongoose.connect(DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
}).then(() => {
  console.log('Connected to DB');
}).catch(err => {
  console.error('Failed to connect to DB', err);
});

// Route imports
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const paystackRoutes = require('./routes/paystack');
const instructorRoutes = require('./routes/instructor');
const affiliateRoutes = require('./routes/affiliate'); // New affiliate route

// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', paystackRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/affiliate', affiliateRoutes); // New affiliate route

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
