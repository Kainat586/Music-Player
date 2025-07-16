const User = require('../models/User');
const bcrypt = require('bcryptjs'); // ✅ Use this if you installed bcryptjs
const express = require('express');
const router = express.Router(); // ✅ THIS LINE IS MISSING

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1d' });
  res.json({ token, user });
});
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashed });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, 'secret', { expiresIn: '1d' });
  res.json({ token, user: newUser });
});

module.exports=router;