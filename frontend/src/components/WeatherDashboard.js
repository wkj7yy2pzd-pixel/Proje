import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherDashboard.css';

const WeatherDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Baku');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = 'b6fd43b5d4af222bbd632ca3f4af8cb0'; // Free OpenWeatherMap key
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: cityName,
          units: 'metric',
          appid: API_KEY,
          lang: 'en'
        }
      });
      setWeather(response.data);
      setCity(cityName);
    } catch (err) {
      setError('Şəhər tapılmadı! Başqa bir şəhər sınayın.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('Baku');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchWeather(input);
      setInput('');
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="weather-dashboard">
      <div className="weather-header">
        <h1>🌍 Weather Dashboard</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Şəhər adını yazın..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Axtar</button>
        </form>
      </div>

      {loading && <div className="loading">Yüklənir...</div>}

      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="weather-container">
          <div className="weather-main">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <div className="temperature">
              <span className="icon">{getWeatherIcon(weather.weather[0].description)}</span>
              <span className="temp">{Math.round(weather.main.temp)}°C</span>
            </div>
            <p className="description">{weather.weather[0].main} - {weather.weather[0].description}</p>
          </div>

          <div className="weather-details">
            <div className="detail-card">
              <span className="detail-label">Hiss olunan</span>
              <span className="detail-value">{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Rütubət</span>
              <span className="detail-value">{weather.main.humidity}%</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Təzyiq</span>
              <span className="detail-value">{weather.main.pressure} hPa</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Küləyin sürəti</span>
              <span className="detail-value">{weather.wind.speed} m/s</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Görmə məsafəsi</span>
              <span className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Əvvəl tabanından hündürlük</span>
              <span className="detail-value">{weather.main.grnd_level} hPa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;