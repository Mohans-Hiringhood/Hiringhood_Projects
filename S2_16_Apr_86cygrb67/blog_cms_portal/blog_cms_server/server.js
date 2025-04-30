const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const userRoutes = require('./src/routes/userRoutes');
const profileRoutes = require('./src/routes/profileRoutes');



// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Blog CMS API is running');
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});