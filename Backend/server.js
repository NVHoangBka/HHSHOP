require('dotenv').config(); // ĐẦU TIÊN

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const appRouter = require('./routes/appRoutes')

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', appRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));