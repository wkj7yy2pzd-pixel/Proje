import React, { useState, useEffect } from 'react';
import './DigitalClock.css';

const DigitalClock = () => {
  const [time, setTime] = useState({});
  const [selectedZones, setSelectedZones] = useState(['UTC', 'Europe/Baku', 'America/New_York', 'Asia/Tokyo']);

  const timeZones = [
    'UTC',
    'Europe/Baku',
    'Europe/London',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Australia/Sydney',
    'America/Toronto',
    'Europe/Paris'
  ];

  useEffect(() => {
    const updateTime = () => {
      const newTime = {};
      selectedZones.forEach(zone => {
        newTime[zone] = new Date().toLocaleString('en-US', {
          timeZone: zone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          weekday: 'short',
          month: 'short',
          day: '2-digit'
        });
      });
      setTime(newTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedZones]);

  const toggleZone = (zone) => {
    setSelectedZones(prev =>
      prev.includes(zone)
        ? prev.filter(z => z !== zone)
        : [...prev, zone]
    );
  };

  return (
    <div className="digital-clock-container">
      <h1>🌍 Global Time Zones</h1>
      
      <div className="clocks-grid">
        {selectedZones.map(zone => (
          <div key={zone} className="clock-card">
            <h2>{zone.replace(/_/g, ' ').split('/')[1] || zone}</h2>
            <div className="time-display">{time[zone]}</div>
            <button 
              className="remove-btn"
              onClick={() => toggleZone(zone)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="timezone-selector">
        <h3>Add Time Zones:</h3>
        <div className="zones-list">
          {timeZones.filter(z => !selectedZones.includes(z)).map(zone => (
            <button
              key={zone}
              className="add-btn"
              onClick={() => toggleZone(zone)}
            >
              + {zone}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
