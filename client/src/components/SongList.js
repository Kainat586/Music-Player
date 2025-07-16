import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SongList.css';

const SongList = ({ onSelect }) => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/songs')
      .then(res => setSongs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="song-list">
      <h3>Available Songs</h3>
      {songs.map(song => (
        <div key={song._id} className="song-card" onClick={() => onSelect(song)}>
          <p><strong>{song.title}</strong> - {song.artist}</p>
        </div>
      ))}
    </div>
  );
};

export default SongList;
