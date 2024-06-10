const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

mongoose.connect(DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to DB');
}).catch(err => {
  console.error(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
