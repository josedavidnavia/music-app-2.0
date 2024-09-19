import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  const fetchSongs = async (searchQuery) => {
    const options = {
      method: 'GET',
      url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
      params: { q: searchQuery },
      headers: {
        'X-RapidAPI-Key': 'd63942416cmsh8835f972ab220c0p1a8baejsn68a79b3b0dfe', 
        'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      setSongs(response.data.data);
      setError('');
    } catch (error) {
      setError('Error fetching songs: ' + error.message);
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value) {
      fetchSongs(e.target.value);
    } else {
      setSongs([]);
    }
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    if (audioRef.current) {
      audioRef.current.src = song.preview;
      audioRef.current.play();
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleNextSong = () => {
    const currentIndex = songs.findIndex((song) => song.id === selectedSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    handleSelectSong(songs[nextIndex]);
  };

  const handlePreviousSong = () => {
    const currentIndex = songs.findIndex((song) => song.id === selectedSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    handleSelectSong(songs[prevIndex]);
  };

  return (
    <div>
      <h1>Music Player</h1>

      {/* Sección de canción seleccionada y controles de reproducción */}
      {selectedSong && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Now playing: {selectedSong.title} by {selectedSong.artist.name}</h2>
          
          {/* Mostrar la portada del álbum */}
          <img 
            src={selectedSong.album.cover_medium} 
            alt={`${selectedSong.title} album cover`} 
            style={{ width: '250px', height: '250px', marginBottom: '10px' }} 
          />
          
          <audio ref={audioRef} controls style={{ marginBottom: '10px' }} />
          <div>
            <button onClick={handlePlay}>Play</button>
            <button onClick={handlePause}>Pause</button>
            <button onClick={handlePreviousSong}>Previous</button>
            <button onClick={handleNextSong}>Next</button>
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for songs..."
        style={{ padding: '5px', borderColor: 'orange', marginBottom: '20px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Lista de canciones */}
      <ul>
        {songs.length > 0 ? (
          songs.map((song) => (
            <li key={song.id} style={{ margin: '10px 0' }}>
              {song.title} - {song.artist.name}{' '}
              <button onClick={() => handleSelectSong(song)}>Play</button>
            </li>
          ))
        ) : (
          <p>No songs found</p>
        )}
      </ul>
    </div>
  );
};

export default MusicPlayer;
