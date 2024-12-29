import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'dark' : 'navbar-light bg-light'}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="logo-wrapper">
            <svg className="logo" width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="currentColor"/>
              <path d="M20 8L28 16L20 24L12 16L20 8Z" fill="currentColor"/>
              <path d="M20 16L28 24L20 32L12 24L20 16Z" fill="currentColor" fillOpacity="0.8"/>
            </svg>
            <span className="logo-text">DevAuth</span>
          </div>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <div className="navbar-nav ms-auto">
            <div className="theme-switch-wrapper">
              <label className="theme-switch">
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={toggleDarkMode}
                />
                <span className="slider round">
                  <span className="slider-icon">
                    {darkMode ? '☀️' : '🌙'}
                  </span>
                </span>
              </label>
            </div>
            {!token ? (
              <>
                <Link className="nav-link" to="/login">Giriş Yap</Link>
                <Link className="nav-link" to="/register">Kayıt Ol</Link>
              </>
            ) : (
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                Çıkış Yap
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 