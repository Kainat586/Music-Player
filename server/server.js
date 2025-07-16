const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const cors = require('cors');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songRoutes'); // ✅

// const app = express();
app.use(cors());
app.use(express.json());

// ✅ Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes); // ✅ This enables /api/songs endpoint

// ✅ MongoDB Connect
mongoose.connect('mongodb://localhost:27017/musicplayer')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🎵 Hello from Music Player backend');
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
