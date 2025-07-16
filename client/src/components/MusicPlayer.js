import React from 'react';
import './MusicPlayer.css';

const MusicPlayer = ({ currentSong }) => {
  if (!currentSong) return null;

  return (
    <div className="music-player">
      <h4>Now Playing: {currentSong.title}</h4>
      <audio controls autoPlay>
        <source src={`http://localhost:5000/uploads/${currentSong.fileUrl || currentSong.filename}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicPlayer;
