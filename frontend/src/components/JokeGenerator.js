import React, { useState } from 'react';
import axios from 'axios';
import './JokeGenerator.css';

const JokeGenerator = () => {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jokeType, setJokeType] = useState('general');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteJokes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);

  const API_URL = 'https://official-joke-api.appspot.com';

  const jokeTypes = [
    { value: 'general', label: 'Ümumi' },
    { value: 'knock-knock', label: 'Tıq-tıq' },
    { value: 'programming', label: 'Proqramçı' }
  ];

  const fetchJoke = async () => {
    setLoading(true);
    setError('');
    try {
      let url;
      if (jokeType === 'general') {
        url = `${API_URL}/random_joke`;
      } else if (jokeType === 'knock-knock') {
        url = `${API_URL}/jokes/knock-knock/random`;
      } else if (jokeType === 'programming') {
        url = `${API_URL}/jokes/programming/random`;
      }

      const response = await axios.get(url);
      const jokeData = response.data;

      const formattedJoke = {
        id: jokeData.id || Date.now(),
        setup: jokeData.setup || 'Hazırlıq',
        punchline: jokeData.punchline || jokeData.joke || 'Məşələ yoxdur',
        type: jokeType,
        timestamp: new Date().toLocaleString('az-AZ')
      };

      setJoke(formattedJoke);
    } catch (err) {
      setError('Məşələ yüklənnədi! Sonra cəhd edin.');
      setJoke(null);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = () => {
    if (joke && !favorites.some(fav => fav.id === joke.id)) {
      const updated = [joke, ...favorites];
      setFavorites(updated);
      localStorage.setItem('favoriteJokes', JSON.stringify(updated));
    }
  };

  const removeFromFavorites = (id) => {
    const updated = favorites.filter(fav => fav.id !== id);
    setFavorites(updated);
    localStorage.setItem('favoriteJokes', JSON.stringify(updated));
  };

  const isFavorited = joke && favorites.some(fav => fav.id === joke.id);

  return (
    <div className="joke-container">
      <div className="joke-header">
        <h1>😂 Məşələ Generatoru</h1>
        <p>Həyatınıza bir az gülüş əlavə edin!</p>
      </div>

      <div className="joke-controls">
        <div className="type-selector">
          <label>Məşələ Türü:</label>
          <select value={jokeType} onChange={(e) => setJokeType(e.target.value)} className="type-select">
            {jokeTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <button onClick={fetchJoke} disabled={loading} className="fetch-btn">
          {loading ? 'Yüklənir...' : '🎲 Yeni Məşələ'}
        </button>

        <button onClick={() => setShowFavorites(!showFavorites)} className="favorites-btn">
          ❤️ Sevdiklərim ({favorites.length})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!showFavorites ? (
        <>
          {joke && (
            <div className="joke-card">
              <div className="joke-content">
                <div className="joke-setup">{joke.setup}</div>
                <div className="joke-punchline">{joke.punchline}</div>
                <div className="joke-meta">
                  <span className="joke-type">{jokeTypes.find(t => t.value === jokeType)?.label}</span>
                  <span className="joke-time">{joke.timestamp}</span>
                </div>
              </div>
              <button
                onClick={addToFavorites}
                disabled={isFavorited}
                className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                title={isFavorited ? 'Artıq sevdiklərə əlavə olunmuş' : 'Sevdiklərə əlavə et'}
              >
                {isFavorited ? '❤️' : '🤍'}
              </button>
            </div>
          )}
          {!joke && !loading && (
            <div className="empty-state">
              <span className="empty-icon">😴</span>
              <p>Bir məşələ yükləmək üçün düyməyə basın!</p>
            </div>
          )}
        </>
      ) : (
        <div className="favorites-container">
          <h2>Sevdiklərim ({favorites.length})</h2>
          {favorites.length > 0 ? (
            <div className="favorites-list">
              {favorites.map(fav => (
                <div key={fav.id} className="favorite-item">
                  <div className="favorite-content">
                    <div className="fav-setup">{fav.setup}</div>
                    <div className="fav-punchline">{fav.punchline}</div>
                    <div className="fav-meta">
                      <span className="fav-type">{jokeTypes.find(t => t.value === fav.type)?.label}</span>
                      <span className="fav-time">{fav.timestamp}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromFavorites(fav.id)}
                    className="remove-btn"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-favorites">
              <p>Hələ heç bir sevdik yoxdur!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JokeGenerator;