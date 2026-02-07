const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));

app.get('/', (req, res) => {
  res.json({ message: 'Library API is running' });
});

app.post('/api/debug/test-login', async (req, res) => {
  const steps = [];
  try {
    const { email, password } = req.body;
    steps.push('1. Received request');
    
    const User = require('./models/User');
    steps.push('2. User model loaded');
    
    const user = await User.findOne({ email }).select('+password');
    steps.push(`3. User found: ${!!user}`);
    
    if (!user) {
      return res.json({ steps, error: 'User not found' });
    }
    
    steps.push(`4. Has password field: ${!!user.password}`);
    
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    steps.push(`5. Password match: ${isMatch}`);
    
    const jwt = require('jsonwebtoken');
    steps.push(`6. JWT_SECRET exists: ${!!process.env.JWT_SECRET}`);
    steps.push(`7. JWT_SECRET length: ${(process.env.JWT_SECRET || '').length}`);
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    steps.push(`8. Token generated: ${!!token}`);
    
    res.json({ success: true, steps });
  } catch (err) {
    res.json({ success: false, steps, error: err.message, stack: err.stack });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    res.json({ 
      status: 'ok', 
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      dbName: mongoose.connection.name || 'unknown',
      env: {
        mongodb: !!process.env.MONGODB_URI,
        jwt: !!process.env.JWT_SECRET
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server Error', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    console.log('MongoDB Connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
