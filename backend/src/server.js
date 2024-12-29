require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const { generalLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 5000;

// Güvenlik middleware'leri
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);

// Global hata yakalayıcı
app.use((err, req, res, next) => {
  console.error('Global hata yakalayıcı:', err);
  res.status(500).json({ 
    error: 'Sunucu hatası',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB bağlantısı
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
    console.log('Ortam:', process.env.NODE_ENV);
  });
}).catch(err => {
  console.error('Sunucu başlatılamadı:', err);
}); 