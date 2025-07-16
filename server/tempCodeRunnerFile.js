
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
