// Home.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Modal from '../components/Modal';
import LoginModalContent from '../components/LoginModalContent';

const SongCard = ({ song, isPlaying, onPlayPause, onStop }) => (
  <div className="song-card">
    <img
      src={`http://localhost:5000${song.coverUrl}`}
      alt={song.title}
      className="song-cover"
      onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
    />
    <h4 className="song-title">{song.title}</h4>
    <p className="song-artist">{song.artist || 'Unknown Artist'}</p>

    {isPlaying ? (
      <>
        <div className="audio-wave">
          {[...Array(5)].map((_, i) => <div key={i} className="audio-bar"></div>)}
        </div>
        <button className="stop-btn" onClick={(e) => { e.stopPropagation(); onStop(); }}>
          ⏹️ Stop
        </button>
      </>
    ) : (
      <button className="play-now" onClick={() => onPlayPause(song)}>
        ▶️ Play Now
      </button>
    )}
  </div>
);

function Home() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/songs')
      .then(res => setSongs(res.data))
      .catch(console.error);
  }, []);

  const handlePlayPause = (song) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (currentSong?._id === song._id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentSong(null);
    }
  };

  const handleProfileClick = () => {
     if (!isLoggedIn) {
    console.log("🔒 Profile clicked. Not logged in. Opening modal...");
    setShowLoginModal(true);
    } else {
      navigate('/profile');
    }
  };

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [currentSong]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentSong(null);
    setIsPlaying(false);
  };

  return (
    <div className="spotify-wrapper">
      <div className="spotify-sidebar">
        <div className="logo">🎵 MusicApp</div>
        <ul className="sidebar-nav">
          <li>Home</li>
          <li>Search</li>
          <li>Your Library</li>
        </ul>
        <div className="footer">© 2025 Music Player</div>
      </div>

      <div className="spotify-main">
        <div className="spotify-navbar">
          <input className="search-bar" type="text" placeholder="Search for songs, artists..." />
          <div className="auth-buttons">
            <button className="btn" onClick={handleProfileClick}>👤 Profile</button>
            {isLoggedIn ? (
              <button className="btn" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <button className="btn" onClick={() => setShowLoginModal(true)}>Login</button>
                <button className="btn" onClick={() => setShowLoginModal(true)}>Signup</button>
              </>
            )}
          </div>
        </div>

        <div className="spotify-section">
          <h2>Featured Songs</h2>
          <div className="card-grid">
            {songs.map(song => (
              <SongCard
                key={song._id}
                song={song}
                isPlaying={currentSong?._id === song._id && isPlaying}
                onPlayPause={handlePlayPause}
                onStop={handleStop}
                progress={progress}
              />
            ))}
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={`http://localhost:5000${currentSong?.fileUrl}`} hidden />
<Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
  <LoginModalContent
    onClose={() => setShowLoginModal(false)}
    setIsLoggedIn={setIsLoggedIn}
  />
</Modal>

      <Modal isOpen={true} onClose={() => setShowLoginModal(false)}>
  <div style={{ background: 'white', padding: '2rem' }}>
    Modal is working ✅
  </div>
</Modal>

    </div>
  );
}

export default Home;
