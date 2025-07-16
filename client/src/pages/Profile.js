// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongUpload from '../components/SongUpload';
import Modal from '../components/Modal';
import './Profile.css';

const Profile = () => {
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState('');
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setName(userData.name);

      axios.get(`http://localhost:5000/api/users/${userData._id}`)
        .then(res => {
          setBio(res.data.bio || '');
          setPreviewPic(`http://localhost:5000${res.data.profilePic}`);
        });

      axios.get(`http://localhost:5000/api/users/${userData._id}/songs`)
        .then(res => setSongs(res.data));

      axios.get(`http://localhost:5000/api/users/${userData._id}/playlists`)
        .then(res => setPlaylists(res.data));
    }
  }, []);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      const res = await axios.put(`http://localhost:5000/api/users/${user._id}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      setMessage('Profile updated successfully!');
    } catch {
      setMessage('Failed to update profile.');
    }
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handlePlaylistCreate = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/${user._id}/playlists`, { name: newPlaylist });
      setShowPlaylistModal(false);
      setNewPlaylist('');
      const res = await axios.get(`http://localhost:5000/api/users/${user._id}/playlists`);
      setPlaylists(res.data);
    } catch (err) {
      console.error('Playlist creation failed');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-navbar">
          <button onClick={() => setShowUploadModal(true)}>🎵 Upload Song</button>
          <button onClick={() => setShowPlaylistModal(true)}>➕ Add Playlist</button>
        </div>
      </div>

      <div className="profile-info">
        <label htmlFor="picInput">
          <img src={previewPic || 'https://via.placeholder.com/150'} alt="profile" className="profile-pic" />
          <div className="edit-overlay">📷</div>
        </label>
        <input id="picInput" type="file" accept="image/*" onChange={handlePicChange} hidden />

        <input value={name} onChange={e => setName(e.target.value)} placeholder="Username" />
        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Your bio..." rows={3} />
        <button onClick={handleSave}>Save</button>
        <p>{message}</p>
      </div>

      <h3>Your Uploaded Songs</h3>
      <div className="songs-list">
        {songs.map(song => (
          <div className="song-item" key={song._id}>
            <img src={`http://localhost:5000${song.coverUrl}`} alt="cover" />
            <p>{song.title}</p>
          </div>
        ))}
      </div>

      <h3>Your Playlists</h3>
      <ul>
        {playlists.map(pl => <li key={pl._id}>{pl.name}</li>)}
      </ul>

      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <SongUpload />
      </Modal>

      <Modal isOpen={showPlaylistModal} onClose={() => setShowPlaylistModal(false)}>
        <h3>Create Playlist</h3>
        <input
          type="text"
          value={newPlaylist}
          onChange={e => setNewPlaylist(e.target.value)}
          placeholder="Playlist Name"
        />
        <button onClick={handlePlaylistCreate}>Create</button>
      </Modal>
    </div>
  );
};

export default Profile;
