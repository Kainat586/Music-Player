// src/components/SongUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const SongUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    audio: null,
    cover: null
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'audio' || name === 'cover') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('artist', formData.artist);
    data.append('album', formData.album);
    data.append('genre', formData.genre);
    data.append('audio', formData.audio);
    data.append('cover', formData.cover);

    try {
      await axios.post('http://localhost:5000/api/songs/upload', data);
      alert('🎉 Song uploaded successfully');
    } catch (err) {
      console.error('Upload failed', err);
      alert('❌ Upload failed');
    }
  };

  return (
    <div className="upload-form">
      <h2>🎶 Upload a New Song</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <input type="text" name="artist" placeholder="Artist" onChange={handleChange} />
        <input type="text" name="album" placeholder="Album" onChange={handleChange} />
        <input type="text" name="genre" placeholder="Genre" onChange={handleChange} />
        <input type="file" name="audio" accept="audio/*" onChange={handleChange} required />
        <input type="file" name="cover" accept="image/*" onChange={handleChange} />
        <button type="submit">Upload Song</button>
      </form>
    </div>
  );
};

export default SongUpload;
