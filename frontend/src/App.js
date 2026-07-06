import React, { useState } from 'react';
import WeatherDashboard from './components/WeatherDashboard';
import TodoList from './components/TodoList';
import JokeGenerator from './components/JokeGenerator';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="app">
      {currentPage === 'home' && (
        <div className="home-page">
          <div className="hero">
            <h1>🌟 Web Uygulamaları</h1>
            <p>React ilə yaradılmış üç faydalı tool</p>
          </div>

          <div className="apps-grid">
            <div className="app-card" onClick={() => setCurrentPage('weather')}>
              <div className="app-icon">🌤️</div>
              <h2>Weather Dashboard</h2>
              <p>Real vaxt hava məlumatı</p>
              <button>Aç →</button>
            </div>

            <div className="app-card" onClick={() => setCurrentPage('todo')}>
              <div className="app-icon">✓️</div>
              <h2>To-Do List</h2>
              <p>Günlük vəzifələri idarə et</p>
              <button>Aç →</button>
            </div>

            <div className="app-card" onClick={() => setCurrentPage('joke')}>
              <div className="app-icon">😂</div>
              <h2>Joke Generator</h2>
              <p>Hər gün yeni məşələ</p>
              <button>Aç →</button>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'weather' && (
        <div className="app-wrapper">
          <button className="back-btn" onClick={() => setCurrentPage('home')}>← Geri</button>
          <WeatherDashboard />
        </div>
      )}

      {currentPage === 'todo' && (
        <div className="app-wrapper">
          <button className="back-btn" onClick={() => setCurrentPage('home')}>← Geri</button>
          <TodoList />
        </div>
      )}

      {currentPage === 'joke' && (
        <div className="app-wrapper">
          <button className="back-btn" onClick={() => setCurrentPage('home')}>← Geri</button>
          <JokeGenerator />
        </div>
      )}
    </div>
  );
}

export default App;