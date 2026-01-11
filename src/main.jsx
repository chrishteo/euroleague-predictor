import React from 'react'
import ReactDOM from 'react-dom/client'
import EuroLeaguePredictor from '../euroleague-predictor.jsx'

// Polyfill for window.storage (used by Claude Artifacts)
// Uses localStorage as a fallback
window.storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    } catch (e) {
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Storage set failed:', e);
    }
  },
  async delete(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage delete failed:', e);
    }
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EuroLeaguePredictor />
  </React.StrictMode>
)
