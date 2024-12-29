import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => navigate('/')
        });
      } else {
        // Hata mesajlarını özelleştir
        if (response.status === 429) {
          // Rate limit hatası
          toast.error(data.error, {
            position: "top-right",
            autoClose: 5000
          });
        } else {
          toast.error(data.error || 'Giriş başarısız', {
            position: "top-right",
            autoClose: 3000
          });
        }
      }
    } catch (error) {
      toast.error('Bağlantı hatası oluştu', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className={`auth-card ${darkMode ? 'dark' : ''}`}>
        <div className="card-body">
          <h2 className="card-title">Giriş Yap</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="mb-3">
              <label className="form-label">Kullanıcı Adı:</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Şifre:</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <i className="fas fa-eye-slash"></i> : 
                    <i className="fas fa-eye"></i>
                  }
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 