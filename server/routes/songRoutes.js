const express = require('express');
const multer = require('multer');
const Song = require('../models/Song');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/upload', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body;
    const audio = req.files['audio']?.[0]?.filename;
    const cover = req.files['cover']?.[0]?.filename;

    const newSong = new Song({
      title,
      artist,
      album,
      genre,
      fileUrl: `/uploads/${audio}`,
      coverUrl: cover ? `/uploads/${cover}` : null
    });

    await newSong.save();
    res.status(201).json({ message: 'Song uploaded', song: newSong });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
});
module.exports = router;
