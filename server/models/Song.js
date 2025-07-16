// server/models/Song.js
const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: String,
  album: String,
  genre: String,
  fileUrl: { type: String, required: true }, // URL to audio file
  coverUrl: String, // URL to album cover image
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Song', SongSchema);
